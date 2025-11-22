import { OrderStatus, OrderType } from '@shared/types/order';
import { ENV } from '@src/config/env';
import { toCashfreeInfoDTO, toRazorpayInfoDTO } from '@src/mappers/order.mapper';
import { OrderModel } from '@src/model/order.model';
import { UserModel } from '@src/model/user.model';
import { cashfree } from '@src/service/cashfree';
import { razorpay } from '@src/service/razorpay';
import { logger } from '@src/utils/logger';
import { withMongooseTransaction } from '@src/utils/with-mongoose-transaction';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { type ClientSession } from 'mongoose';
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { createPlanUpgradeTemplate, sendMail } from '@src/service/mail';

export const razorpayWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    await withMongooseTransaction(async (session: ClientSession) => {
        const webhookSecret = ENV.RAZORPAY_WEBHOOK_SECRET;
        const payload = req.body;
        const signature = req.headers['x-razorpay-signature'] as string;

        const payloadString = payload.toString('utf-8') as string;
        const isValid = validateWebhookSignature(payloadString, signature, webhookSecret);

        // check if the webhook signature is valid. Send 400 error if invalid to Razorpay
        if (!isValid) {
            logger.error(`Invalid webhook signature: ${signature}`);
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }

        const event = JSON.parse(payloadString);
        const eventType = event.event;
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id as string;
        const paymentId = payment.id as string;

        const order = await OrderModel.findOne({ 'gatewayInfo.razorpay.orderId': orderId });

        if (order === null) {
            logger.error(`Order not found for ${eventType}: ${orderId}`);
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        if (eventType === 'payment.captured') {
            if (order.status === OrderStatus.PAID) {
                logger.info(`Order already paid: ${orderId}`);
                res.sendStatus(StatusCodes.OK);
                return;
            }

            logger.info(`Payment captured for razorpay_order_id: ${orderId}`);

            const razorpayOrder = await razorpay.orders.fetch(orderId);

            order.gatewayInfo = {
                razorpay: toRazorpayInfoDTO(razorpayOrder, paymentId, signature),
            };
            order.status = OrderStatus.PAID;
            await order.save({ session });

            // update the user
            const user = await UserModel.findById(order.user);

            if (order.type === OrderType.PLAN) {
                if (
                    typeof order.planName !== 'string' ||
                    order.planName === null ||
                    order.planName === undefined
                ) {
                    logger.error(`Plan name not found for razorpay_order_id: ${orderId}`);
                    res.sendStatus(StatusCodes.BAD_REQUEST);
                    return;
                }

                if (user) {
                    // Store previous plan info before renewal
                    const previousPlan = user.planType;

                    // Renew the plan
                    await user.renewPlan(order.planName, session, (user) => {
                        const emailBody = createPlanUpgradeTemplate(
                            user.name,
                            previousPlan,
                            user.planType,
                            user.planExpiry,
                        );
                        sendMail(user.email, 'Your Plan Has Been Updated', emailBody);
                    });
                }
            }

            logger.info(`Order marked as paid: ${orderId}`);
        } else if (eventType === 'payment.failed') {
            const reason =
                typeof payment.error_description === 'string'
                    ? payment.error_description.trim()
                    : 'Unknown failure reason';

            logger.warn(`Payment failed for razorpay_order_id: ${orderId} - Reason: ${reason}`);

            order.gatewayInfo = {
                razorpay: toRazorpayInfoDTO(
                    await razorpay.orders.fetch(orderId),
                    paymentId,
                    signature,
                    reason as string,
                ),
            };

            order.status = OrderStatus.FAILED;

            await order.save({ session });
            logger.info(`Order marked as failed: ${orderId}`);
        }

        // sent the webhook response back to Razorpay
        res.sendStatus(StatusCodes.OK);
    });
};

export const cashfreeWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    await withMongooseTransaction(async (session: ClientSession) => {
        const timestamp = req.headers['x-webhook-timestamp'];
        const signature = req.headers['x-webhook-signature'];
        const rawBody = req.body as string;

        try {
            const event = cashfree.PGVerifyWebhookSignature(
                signature as string,
                rawBody,
                timestamp as string,
            );

            const type = event.object?.type;
            const orderId = event.object?.data?.order?.order_id as string;

            if (orderId === undefined || type === undefined) {
                logger.warn('Webhook missing orderId or type');
                res.sendStatus(StatusCodes.BAD_REQUEST);
                return;
            }

            const order = await OrderModel.findOne({ 'gatewayInfo.cashfree.orderId': orderId });

            if (order === null) {
                logger.error(`Order not found for ${type}: ${orderId}`);
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }

            const isPaid = type === 'PAYMENT_SUCCESS_WEBHOOK';
            const isFailed = type === 'PAYMENT_FAILED_WEBHOOK';

            if (
                (isPaid && order.status === OrderStatus.PAID) ||
                (isFailed && order.status === OrderStatus.FAILED)
            ) {
                logger.info(`Order already ${order.status}: ${orderId}`);
                res.sendStatus(StatusCodes.OK);
                return;
            }

            logger.info(
                `${isPaid ? 'Payment captured' : 'Payment failed'} for cashfree_order_id: ${orderId}`,
            );

            const { data: cashfreeOrder } = await cashfree.PGFetchOrder(orderId);
            order.gatewayInfo = { cashfree: toCashfreeInfoDTO(cashfreeOrder) };
            order.status = isPaid ? OrderStatus.PAID : OrderStatus.FAILED;

            if (order.status === OrderStatus.PAID) {
                // update the user
                const user = await UserModel.findById(order.user);

                if (order.type === OrderType.PLAN) {
                    if (
                        typeof order.planName !== 'string' ||
                        order.planName === null ||
                        order.planName === undefined
                    ) {
                        logger.error(`Plan name not found for cashfree_order_id: ${orderId}`);
                        res.sendStatus(StatusCodes.BAD_REQUEST);
                        return;
                    }

                    if (user) {
                        // Store previous plan info before renewal
                        const previousPlan = user.planType;

                        // Renew the plan
                        await user.renewPlan(order.planName, session, (user) => {
                            const emailBody = createPlanUpgradeTemplate(
                                user.name,
                                previousPlan,
                                user.planType,
                                user.planExpiry,
                            );
                            sendMail(user.email, 'Your Plan Has Been Updated', emailBody);
                        });
                    }
                }
            }

            await order.save({ session });

            logger.info(
                `Order marked as ${order.status}: ${orderId} - ${cashfreeOrder.order_status}`,
            );

            res.sendStatus(StatusCodes.OK);
        } catch (error) {
            next(error);
        }
    });
};

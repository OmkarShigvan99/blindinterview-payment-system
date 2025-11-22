import { OrderStatus, OrderType, PaymentProvider } from '@shared/types/order';
import { ENV } from '@src/config/env';
import type { Payload } from '@src/config/strategy';
import { toCashfreeInfoDTO, toOrderDTO, toRazorpayInfoDTO } from '@src/mappers/order.mapper';
import { OrderModel } from '@src/model/order.model';
import { createRazorpayOrder, razorpay } from '@src/service/razorpay';
import { ApiResponse } from '@src/utils/api-response';
import { withMongooseTransaction } from '@src/utils/with-mongoose-transaction';
import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { ClientSession } from 'mongoose';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
import { cashfree, createCashfreeOrder } from '@src/service/cashfree';
import { type CurrencyCode, toMinorUnit } from '@shared/utils/currency.utils';
import { convertINRToLocalCurrency, convertToINR } from '@src/utils/currency';
import { PricingTierModel } from '@src/model/pricing-tier.model';
import type { CountryCode2 } from '@shared/utils/country.utils';
import { UserModel } from '@src/model/user.model';
import { logger } from '@src/utils/logger';
import type { CreateOrderRequest } from 'cashfree-pg';
import { ORDER_ERRORS } from '@src/constants';
import { createPlanUpgradeTemplate, sendMail } from '@src/service/mail';

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    await withMongooseTransaction(async (session: ClientSession) => {
        let {
            country,
            provider,
            plan,
            type,
            acceptedTerms,
            acceptedRefundPolicy,
            acceptedPrivacyPolicy,
        } = req.body;

        const user = req.user as Payload;

        // Log policy acceptance for audit purposes
        logger.info('Order creation with policy acceptance', {
            userId: user.id,
            userEmail: user.email,
            acceptedTerms,
            acceptedRefundPolicy,
            acceptedPrivacyPolicy,
            plan,
            type,
            country,
            provider,
            timestamp: new Date().toISOString(),
        });

        let amount: number;
        let currency: CurrencyCode;
        let credits: number | 'unlimited';
        if (type === OrderType.PLAN) {
            const priceTier = await PricingTierModel.findOne({ name: plan });
            if (priceTier === null) {
                res.status(StatusCodes.NOT_FOUND).json(
                    new ApiResponse(false, ORDER_ERRORS.PRICE_TIER_NOT_FOUND, {
                        reason: 'No price tier found with this name',
                    }),
                );
                return;
            }

            const { convertedAmount, currencyCode } = await convertINRToLocalCurrency(
                priceTier.basePrice,
                country as CountryCode2,
                {
                    value: priceTier.referencePPP.value,
                    country: priceTier.referencePPP.country,
                },
            );
            amount = convertedAmount;
            currency = currencyCode;
            credits = priceTier.creditsIncluded;
        } else {
            res.status(StatusCodes.NOT_FOUND).json(
                new ApiResponse(false, ORDER_ERRORS.ORDER_TYPE_NOT_FOUND, {
                    reason: 'No order type found with this name',
                }),
            );
            return;
        }

        // const amount = calculateAmountFromCredits(credits as number, currency as Currency);

        const order = new OrderModel({
            user: user.id,
            amount,
            currency,
            credits,
            type,
            planName: plan,
            status: OrderStatus.CREATED,
            provider: provider as PaymentProvider,
            gatewayData: {},
            acceptedTerms,
            acceptedRefundPolicy,
            acceptedPrivacyPolicy,
        });

        switch (provider as PaymentProvider) {
            case PaymentProvider.RAZORPAY:
                {
                    const notes: Record<string, string | number> = {};
                    notes.userId = user.id;
                    notes.email = user.email;

                    const razorpayOrder = await createRazorpayOrder({
                        amount: toMinorUnit(amount, currency),
                        currency,
                        receipt: 'receipt#' + String(order._id),
                        notes,
                    });

                    order.gatewayInfo = { razorpay: toRazorpayInfoDTO(razorpayOrder) };

                    await order.save({ session });
                }
                break;
            case PaymentProvider.CASHFREE:
                {
                    const options: CreateOrderRequest = {
                        order_amount: await convertToINR(amount, currency, country as CountryCode2),
                        order_currency: 'INR',
                        order_id: String(order._id),
                        customer_details: {
                            customer_id: user.id,
                            customer_name: user.name,
                            customer_email: user.email,
                            customer_phone: '9999999999',
                        },
                        order_meta: {
                            return_url: `${ENV.FRONTEND_URL}/verify-payment?provider=${provider}&orderId=${String(order._id)}`,
                        },
                    };
                    const cashfreeOrder = await createCashfreeOrder(options);

                    order.gatewayInfo = { cashfree: toCashfreeInfoDTO(cashfreeOrder) };

                    await order.save({ session });
                }
                break;
            default:
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(false, ORDER_ERRORS.PAYMENT_PROVIDER_NOT_SUPPORTED, {
                        reason: 'Payment provider not supported',
                    }),
                );
        }

        res.status(StatusCodes.CREATED).json(
            new ApiResponse(true, 'Order created successfully', toOrderDTO(order)),
        );
    });
}

export async function verifyRazorpayPayment(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    await withMongooseTransaction(async (session: ClientSession) => {
        const { orderId, paymentId, signature } = req.body;

        const order = await OrderModel.findOne({ 'gatewayInfo.razorpay.orderId': orderId });

        if (order === null) {
            res.status(StatusCodes.NOT_FOUND).json(
                new ApiResponse(false, ORDER_ERRORS.ORDER_NOT_FOUND, {
                    reason: 'No order found with this id',
                }),
            );
            return;
        }

        if (order.status === OrderStatus.PAID) {
            res.status(StatusCodes.OK).json(
                new ApiResponse(true, 'Payment already verified', order),
            );
            return;
        }

        // verify the payment
        const isPaymentVerified = validatePaymentVerification(
            {
                order_id: orderId,
                payment_id: paymentId,
            },
            signature as string,
            ENV.RAZORPAY_KEY_SECRET,
        );

        // if payment is not verified
        if (!isPaymentVerified) {
            res.status(StatusCodes.BAD_REQUEST).json(
                new ApiResponse(false, ORDER_ERRORS.PAYMENT_VERIFICATION_FAILED, {
                    reason: 'Payment verification failed',
                }),
            );
            return;
        }

        // fetch the order details from razorpay
        const razorpayOrder = await razorpay.orders.fetch(orderId as string);

        // update the order
        order.gatewayInfo = { razorpay: toRazorpayInfoDTO(razorpayOrder), paymentId, signature };
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
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(false, ORDER_ERRORS.PLAN_NAME_NOT_FOUND, {
                        reason: 'Plan name not found',
                    }),
                );
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

        res.status(StatusCodes.OK).json(
            new ApiResponse(true, 'Payment verified successfully', order),
        );
    });
}

export async function verifyCashfreePayment(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    await withMongooseTransaction(async (session: ClientSession) => {
        const { orderId } = req.body;

        const order = await OrderModel.findOne({ 'gatewayInfo.cashfree.orderId': orderId });

        if (order === null) {
            res.status(StatusCodes.NOT_FOUND).json(
                new ApiResponse(false, ORDER_ERRORS.ORDER_NOT_FOUND, {
                    reason: 'No order found with this id',
                }),
            );
            return;
        }

        if (order.status === OrderStatus.PAID) {
            res.status(StatusCodes.OK).json(
                new ApiResponse(true, 'Payment already verified', order),
            );
            return;
        }

        // fetch the order details from cashfree
        const response = await cashfree.PGFetchOrder(orderId as string);

        const cashfreeOrder = response.data;

        if (cashfreeOrder.order_status === 'PAID') {
            // update the order
            order.gatewayInfo = { cashfree: toCashfreeInfoDTO(cashfreeOrder) };
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
                    logger.error(`Plan name not found for cashfree_order_id: ${orderId}`);
                    res.status(StatusCodes.BAD_REQUEST).json(
                        new ApiResponse(false, ORDER_ERRORS.PLAN_NAME_NOT_FOUND, {
                            reason: 'Plan name not found',
                        }),
                    );
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

            res.status(StatusCodes.OK).json(
                new ApiResponse(true, 'Payment verified successfully', order),
            );
        } else {
            res.status(StatusCodes.BAD_REQUEST).json(
                new ApiResponse(false, ORDER_ERRORS.PAYMENT_VERIFICATION_FAILED, {
                    reason: 'Payment verification failed',
                }),
            );
        }
    });
}

export async function getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = req.user as Payload;

    const page = !Number.isNaN(parseInt(req.query.page as string, 10))
        ? parseInt(req.query.page as string, 10)
        : 1;
    const limit = !Number.isNaN(parseInt(req.query.limit as string, 10))
        ? parseInt(req.query.limit as string, 10)
        : 10;
    const skip = (page - 1) * limit;

    try {
        const [orders, total] = await Promise.all([
            OrderModel.find({ user: user.id })
                .sort({ createdAt: -1 }) // Optional: latest first
                .skip(skip)
                .limit(limit),
            OrderModel.countDocuments({ user: user.id }),
        ]);

        res.status(StatusCodes.OK).json(
            new ApiResponse(true, 'Orders fetched successfully', {
                data: orders.map(toOrderDTO),
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                },
            }),
        );
    } catch (err) {
        next(err);
    }
}

export async function getUserOrders(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const { id: userId } = req.params;

    const page = !Number.isNaN(parseInt(req.query.page as string, 10))
        ? parseInt(req.query.page as string, 10)
        : 1;
    const limit = !Number.isNaN(parseInt(req.query.limit as string, 10))
        ? parseInt(req.query.limit as string, 10)
        : 10;
    const skip = (page - 1) * limit;

    try {
        const [orders, total] = await Promise.all([
            OrderModel.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            OrderModel.countDocuments({ user: userId }),
        ]);

        res.status(StatusCodes.OK).json(
            new ApiResponse(true, 'Orders fetched successfully', {
                data: orders.map(toOrderDTO),
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                },
            }),
        );
    } catch (err) {
        next(err);
    }
}

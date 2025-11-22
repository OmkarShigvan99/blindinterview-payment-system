import {
    createOrder,
    getOrders,
    getUserOrders,
    verifyCashfreePayment,
    verifyRazorpayPayment,
} from '@src/controller/order.controller';
import { authenticateJwt, isAdmin, isEmailVerified } from '@src/middleware/auth.middleware';
import { validate } from '@src/middleware/validation.middleware';
import { Router, type Router as ExpressRouter } from 'express';
import {
    createOrderSchema,
    razorpayPaymentVerificationSchema,
    cashfreePaymentVerificationSchema,
} from '@shared/schemas/order.schema';
import { catchAsync } from '@src/utils/catch-async';
import type { ZodTypeAny } from 'zod';
import { idSchema } from '@src/schema/general.schema';

export const orderRouter: ExpressRouter = Router();

orderRouter.post(
    '/create',
    validate(createOrderSchema as ZodTypeAny, 'body'),
    authenticateJwt('access-jwt'),
    isEmailVerified,
    catchAsync(createOrder),
);

orderRouter.post(
    '/verify-payment/razorpay',
    validate(razorpayPaymentVerificationSchema as ZodTypeAny, 'body'),
    authenticateJwt('access-jwt'),
    catchAsync(verifyRazorpayPayment),
);

orderRouter.post(
    '/verify-payment/cashfree',
    validate(cashfreePaymentVerificationSchema as ZodTypeAny, 'body'),
    authenticateJwt('access-jwt'),
    catchAsync(verifyCashfreePayment),
);

orderRouter.get('/all', authenticateJwt('access-jwt'), isAdmin, catchAsync(getOrders));
orderRouter.get(
    '/user/:id',
    validate(idSchema as ZodTypeAny, 'params'),
    authenticateJwt('access-jwt'),
    catchAsync(getUserOrders),
);

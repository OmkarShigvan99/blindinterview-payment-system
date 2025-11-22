import { cashfreeWebhook, razorpayWebhook } from '@src/controller/webhooks.controller';
import { catchAsync } from '@src/utils/catch-async';
import { Router, type Router as ExpressRouter } from 'express';

export const webhooksRouter: ExpressRouter = Router();

webhooksRouter.post('/razorpay', catchAsync(razorpayWebhook));

webhooksRouter.post('/cashfree', catchAsync(cashfreeWebhook));

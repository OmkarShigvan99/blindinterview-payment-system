import { z } from 'zod';
import { OrderType, PaymentProvider } from '../types/order';
import { enumToValues } from '../utils/enum-values';
import { countryCode2Schema } from '../utils/country.utils';

// Common fields
const baseFields = {
    provider: z.nativeEnum(PaymentProvider, {
        required_error: 'Provider is required',
        invalid_type_error: `Provider must be one of ${enumToValues(PaymentProvider)}`,
    }),
    country: countryCode2Schema,
    acceptedTerms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the Terms and Conditions to proceed',
    }),
    acceptedRefundPolicy: z.boolean().refine((val) => val === true, {
        message: 'You must acknowledge the No Refund Policy to proceed',
    }),
    acceptedPrivacyPolicy: z.boolean().refine((val) => val === true, {
        message: 'You must accept the Privacy Policy to proceed',
    }),
};

// Subscription order schema
const planSchema = z.object({
    ...baseFields,
    type: z.literal(OrderType.PLAN),
    plan: z.string({ required_error: 'Plan name is required' }),
});

// Final schema with conditional validation
export const createOrderSchema = z.discriminatedUnion('type', [planSchema]);

export const razorpayPaymentVerificationSchema = z.object({
    orderId: z
        .string()
        .min(1, { message: 'Razorpay Order ID is required' })
        .refine((val) => val.startsWith('order_'), {
            message: 'Invalid Razorpay Order ID format',
        }),

    paymentId: z
        .string()
        .min(1, { message: 'Razorpay Payment ID is required' })
        .refine((val) => val.startsWith('pay_'), {
            message: 'Invalid Razorpay Payment ID format',
        }),

    signature: z
        .string()
        .min(1, { message: 'Razorpay Signature is required' })
        .regex(/^[a-f0-9]{64}$/, {
            message: 'Invalid signature format',
        }),
});

export const cashfreePaymentVerificationSchema = z.object({
    orderId: z.string().regex(/^[a-f0-9]{24}$/, {
        message: 'Invalid Cashfree internal order ID. Must be a 24-character hex string.',
    }),
});

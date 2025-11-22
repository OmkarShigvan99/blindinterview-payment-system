import { ENV } from '@src/config/env';
import Razorpay from 'razorpay';
import type { Orders } from 'razorpay/dist/types/orders';

export const razorpay = new Razorpay({
    key_id: ENV.RAZORPAY_KEY_ID,
    key_secret: ENV.RAZORPAY_KEY_SECRET,
});

export async function createRazorpayOrder({
    amount,
    currency,
    receipt,
    notes,
}: {
    amount: number;
    currency: string;
    receipt: string;
    notes: Record<string, string | number>;
}): Promise<Orders.RazorpayOrder> {
    return await razorpay.orders.create({
        amount,
        currency,
        receipt,
        notes,
    });
}

import {
    type CashfreeInfo,
    OrderStatus,
    type OrderDTO,
    type RazorpayInfo,
} from '@shared/types/order';
import type { IOrderDocument } from '@src/model/order.model';
import type { OrderEntity } from 'cashfree-pg';
import type { Orders } from 'razorpay/dist/types/orders';

export function toOrderDTO(order: IOrderDocument): OrderDTO {
    return {
        id: String(order._id),
        amount: order.amount,
        currency: order.currency,
        credits: order.credits,
        status: order.status,
        provider: order.provider,
        gatewayData: order.gatewayInfo,
        type: order.type,
        planType: order.planName,
        user: typeof order.user === 'string' ? order.user : '',
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
    };
}

export function toRazorpayInfoDTO(
    razorpayInfo: Orders.RazorpayOrder,
    paymentId?: string,
    signature?: string,
    failureReason?: string,
): RazorpayInfo {
    return {
        orderId: razorpayInfo.id,
        amount: razorpayInfo.amount_due,
        currency: razorpayInfo.currency,
        receipt: razorpayInfo.receipt,
        status: failureReason !== undefined ? OrderStatus.FAILED : razorpayInfo.status,
        attempts: razorpayInfo.attempts,
        createdAt: razorpayInfo.created_at,
        notes: normalizeRazorpayNotes(razorpayInfo.notes),
        paymentId,
        signature,
        failureReason,
    };
}

export const toCashfreeInfoDTO = (data: OrderEntity): CashfreeInfo => ({
    orderId: data.order_id,
    cfOrderId: data.cf_order_id,
    amount: data.order_amount,
    currency: data.order_currency,
    status: data.order_status,
    createdAt: data.created_at,
    expiresAt: data.order_expiry_time,
    paymentSessionId: data.payment_session_id,
    customer: {
        id: data.customer_details?.customer_id,
        name: data.customer_details?.customer_name,
        email: data.customer_details?.customer_email,
    },
    returnUrl: data.order_meta?.return_url,
    note: data.order_note,
    tags: data.order_tags,
});

function normalizeRazorpayNotes(
    notes?: Record<string, string | number | null>,
): Record<string, string> {
    const result: Record<string, string> = {};

    if (notes === undefined) return result;

    for (const [key, value] of Object.entries(notes)) {
        if (value !== null) {
            result[key] = value.toString();
        }
    }

    return result;
}

import { CurrencyCode } from '../utils/currency.utils';
import { UserDTO } from './user';
import { Plans } from './pricingTier';

export enum OrderStatus {
    CREATED = 'created',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}
export enum OrderType {
    PLAN = 'plan',
}

export enum PaymentProvider {
    RAZORPAY = 'razorpay',
    CASHFREE = 'cashfree',
}

export interface OrderDTO {
    id: string; // order._id
    amount: number;
    currency: CurrencyCode;
    credits: number | 'unlimited';
    status: OrderStatus;
    provider: PaymentProvider;
    type: OrderType;
    planType?: Plans;
    gatewayData?: GatewayInfo;
    user: UserDTO['id'];
    createdAt: string; // or Date
    updatedAt: string; // or Date
}

export interface RazorpayInfo {
    orderId: string; // 'id' from Razorpay (required for verification)
    amount: number; // Total order amount in paise
    currency: string; // Typically 'INR', but good to store explicitly
    receipt?: string; // Your internal receipt ID (if you use it)
    status: string; // 'created' | 'paid' | 'attempted'
    attempts: number; // Number of payment attempts
    createdAt: number; // Unix timestamp (Razorpay's, for auditing)
    notes?: Record<string, string | number>; // Optional metadata Razorpay allows
    paymentId?: string; // Payment ID from Razorpay
    signature?: string; // Payment signature
    failureReason?: string;
}

export interface CashfreeInfo {
    orderId?: string;
    cfOrderId?: string;
    amount?: number;
    currency?: string;
    status?: string;
    paymentSessionId?: string;
    createdAt?: string;
    expiresAt?: string;
    customer?: {
        id?: string;
        name?: string;
        email?: string;
    };
    returnUrl?: string;
    note?: string;
    tags?: Record<string, string>;
}

export interface GatewayInfo {
    razorpay?: RazorpayInfo;
    cashfree?: CashfreeInfo;
    [key: string]: any; // Allow extensibility
}

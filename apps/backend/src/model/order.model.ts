import { Schema, model, type Document } from 'mongoose';
import { type GatewayInfo, OrderStatus, OrderType, PaymentProvider } from '@shared/types/order';
import { enumToValues } from '@shared/utils/enum-values';
import { currencyCodeSchema, type CurrencyCode } from '@shared/utils/currency.utils';
import { Plans } from '@shared/types/pricingTier';

interface IOrder {
    user: Schema.Types.ObjectId;
    amount: number;
    credits: number | 'unlimited';
    status: OrderStatus;
    type: OrderType;
    currency: CurrencyCode;
    planName?: Plans;
    provider: PaymentProvider;
    gatewayInfo?: GatewayInfo;
    acceptedTerms: boolean;
    acceptedRefundPolicy: boolean;
    acceptedPrivacyPolicy: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderDocument extends IOrder, Document {}

const OrderSchema = new Schema<IOrderDocument>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        credits: { type: Schema.Types.Mixed, required: true },
        status: { type: String, enum: enumToValues(OrderStatus), default: OrderStatus.CREATED },
        currency: { type: String, enum: enumToValues(currencyCodeSchema.enum), required: true },
        type: { type: String, enum: enumToValues(OrderType), required: true },
        planName: {
            type: String,
            enum: enumToValues(Plans),
            default: Plans.FREE,
        },
        provider: { type: String, enum: enumToValues(PaymentProvider), required: true },
        gatewayInfo: { type: Schema.Types.Mixed },
        acceptedTerms: { type: Boolean, required: true, default: false },
        acceptedRefundPolicy: { type: Boolean, required: true, default: false },
        acceptedPrivacyPolicy: { type: Boolean, required: true, default: false },
    },
    { timestamps: true },
);

export const OrderModel = model<IOrderDocument>('Order', OrderSchema);

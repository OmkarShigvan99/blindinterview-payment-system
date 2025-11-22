import type { CountryCode2 } from '@shared/utils/country.utils';
import { type Document, model, Schema } from 'mongoose';
import { enumToValues } from '@shared/utils/enum-values';
import { type CurrencyCode, currencyCodeSchema } from '@shared/utils/currency.utils';

export interface IPricingTier {
    name: string;
    description: string;
    currency: CurrencyCode;
    basePrice: number;
    creditsIncluded: number | 'unlimited';
    expiryInDays: number | 'unlimited';
    referencePPP: {
        country: CountryCode2;
        value: number;
        year: number;
    };
    isActive: boolean;
    features: string[];
}

export interface IPricingTierDocument extends IPricingTier, Document {}

const PricingTierSchema = new Schema<IPricingTierDocument>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        currency: {
            type: String,
            enum: enumToValues(currencyCodeSchema.enum),
            required: true,
            default: 'INR',
        },
        basePrice: { type: Number, required: true, default: 0 },
        creditsIncluded: { type: Schema.Types.Mixed, required: true, default: 0 },
        expiryInDays: { type: Schema.Types.Mixed, required: true, default: 30 },
        referencePPP: {
            type: Schema.Types.Mixed,
            required: true,
            default: { country: 'IN', value: 1, year: 2024 },
        },
        isActive: { type: Boolean, required: true, default: true },
        features: { type: [String], required: true, default: [] },
    },
    { timestamps: true },
);

export const PricingTierModel = model<IPricingTierDocument>('PricingTier', PricingTierSchema);

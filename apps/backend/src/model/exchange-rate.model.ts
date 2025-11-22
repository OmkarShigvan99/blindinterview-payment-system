import { model, Schema, type Document } from 'mongoose';

interface IExchangeRates {
    baseCurrency: string;
    conversionRates: Map<string, number>;
}

export interface IExchangeRatesDocument extends Document, IExchangeRates {}

export const exchangeRateSchema = new Schema<IExchangeRatesDocument>(
    {
        baseCurrency: { type: String, required: true },
        conversionRates: { type: Map, of: Number, required: true },
    },
    {
        timestamps: true,
    },
);

export const ExchangeRateModel = model<IExchangeRatesDocument>('ExchangeRate', exchangeRateSchema);

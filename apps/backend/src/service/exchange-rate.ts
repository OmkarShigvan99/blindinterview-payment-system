import { ENV } from '@src/config/env';
import { ExchangeRateModel } from '@src/model/exchange-rate.model';
import { logger } from '@src/utils/logger';

export async function getExchangeRate(currency: string): Promise<void> {
    try {
        const exchangeRate = await ExchangeRateModel.findOne({ baseCurrency: currency });
        if (exchangeRate !== null) {
            logger.info(`✅ Exchange rate for ${currency} already configured`);
            return;
        }

        const response = await fetch(
            `${ENV.EXCHANGE_RATE_API_LINK}/${ENV.EXCHANGE_RATE_API_KEY}/latest/${currency}`,
        );

        const data = await response.json();

        // Type guard to check if data has conversion_rates property
        if (
            !(
                typeof data === 'object' &&
                data !== null &&
                'conversion_rates' in data &&
                typeof data.conversion_rates === 'object' &&
                data.conversion_rates !== null
            )
        ) {
            throw new Error('Invalid response format from exchange rate API');
        }

        await ExchangeRateModel.findOneAndUpdate(
            { baseCurrency: currency },
            { conversionRates: data.conversion_rates },
            { upsert: true, new: true },
        );
        logger.info(`✅ Exchange rate for ${currency} configured successfully`);
    } catch (error) {
        logger.error(`Error fetching exchange rate: ${JSON.stringify(error)}`);
    }
}

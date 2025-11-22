import {
    type CurrencyCode,
    getCurrencyCode,
    getCurrencyPrecision,
} from '@shared/utils/currency.utils';
import { getLatestPPP } from '@src/service/power-parity';
import { ExchangeRateModel } from '@src/model/exchange-rate.model';
import { type CountryCode2, getCountryNumericCode } from '@shared/utils/country.utils';
import { logger } from '@src/utils/logger'; // Added logger import

export interface PPPInfo {
    country: CountryCode2;
    value: number;
    year?: number;
}

const DEFAULT_ALPHA = 0.5;
const DEFAULT_MIN_BASE_INR = 300;
const DEFAULT_CAP_MULTIPLIER = 2.5;
const DEFAULT_PPP: PPPInfo = { country: 'IN', value: 1, year: 2024 };

const roundToCharmPrice = (value: number, precision: number): number => {
    const oneUnit = Math.pow(10, -precision); // 0.01 for precision 2

    let charmValue: number;

    if (value >= 100) {
        // 3000 → 2999.00
        const floored = Math.floor(value / 100) * 100;
        charmValue = floored - 1; // 2999
    } else if (value >= 10) {
        // 87.42 → 86.99
        const floored = Math.floor(value);
        charmValue = floored - 1 + (1 - oneUnit); // 86.99
    } else if (value > 1) {
        // 7.45 → 6.99
        const floored = Math.floor(value);
        charmValue = floored - 1 + (1 - oneUnit); // 6.99
    } else {
        // For 1 or lower, keep at 0.99 or 0.00 safely
        charmValue = Math.max(0, value - oneUnit);
    }

    return Number(charmValue.toFixed(precision));
};

const getCharmBase = (value: number): number => {
    if (value >= 1000) return 100;
    if (value >= 100) return 10;
    if (value >= 10) return 1;
    if (value >= 1) return 0.1;
    return 0.01; // for very small prices
};

function resolveNumericCountryCode(countryISO2: string): string {
    const code = getCountryNumericCode(countryISO2);
    if (code == null) {
        logger.warn(`Invalid country ISO2: ${countryISO2}. Falling back to US.`);
        return getCountryNumericCode('US') ?? '840';
    }
    return code;
}

function resolveCurrencyCode(numericCode: string): string {
    const currency = getCurrencyCode(numericCode);
    if (currency == null) {
        logger.warn(`Missing currency code for numeric ${numericCode}. Defaulting to USD.`);
        return 'USD';
    }
    return currency;
}

async function resolvePPP(targetISO2: string): Promise<PPPInfo> {
    const result = await getLatestPPP(targetISO2);

    if (
        result == null ||
        typeof result.value !== 'number' ||
        isNaN(result.value) ||
        result.value <= 0
    ) {
        logger.warn(
            `PPP invalid for ${targetISO2}. Using fallback PPP from ${DEFAULT_PPP.country}.`,
        );
        return DEFAULT_PPP;
    }
    return result;
}

function calculateAdjustedPrice({
    amountINR,
    rate,
    pppRatio,
    options,
}: {
    amountINR: number;
    rate: number;
    pppRatio: number;
    options: {
        alpha: number;
        minBaseINR: number;
        capMultiplier: number;
    };
}): number {
    const { alpha, minBaseINR, capMultiplier } = options;

    const smoothedPPP = Math.pow(pppRatio, alpha);
    const adjusted = amountINR * rate * smoothedPPP;
    const minPrice = minBaseINR * rate * smoothedPPP;
    const maxPrice = amountINR * rate * capMultiplier;

    return Math.min(Math.max(adjusted, minPrice), maxPrice);
}

function extractRateFromDoc(
    rates: Map<string, number> | undefined,
    currencyCode: string,
): number | undefined {
    if (rates instanceof Map) {
        return rates.get(currencyCode);
    }

    logger.warn(`conversionRates has unexpected type: ${typeof rates}`);
    return undefined;
}

function getFallbackRate(referencePPP: PPPInfo, targetPPP: PPPInfo): number | undefined {
    if (referencePPP.value > 0 && targetPPP.value > 0) {
        const fallback = referencePPP.value / targetPPP.value;
        logger.warn(
            `Using PPP fallback for rate: ${referencePPP.value} / ${targetPPP.value} = ${fallback.toFixed(4)}`,
        );
        return fallback;
    }

    logger.warn('PPP fallback failed: invalid values.');
    return undefined;
}

export async function getExchangeRateINRtoTargetCurrency(
    currencyCode: string,
    referencePPP: PPPInfo,
    targetPPP: PPPInfo,
): Promise<number> {
    try {
        const doc = await ExchangeRateModel.findOne({ baseCurrency: 'INR' });
        const rate = extractRateFromDoc(doc?.conversionRates, currencyCode);

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Rate must be greater than 0
        if (typeof rate === 'number' && rate > 0 && !isNaN(rate)) {
            return rate;
        }

        const fallbackRate = getFallbackRate(referencePPP, targetPPP);
        if (fallbackRate !== undefined) return fallbackRate;
    } catch (err) {
        logger.warn(`Error fetching exchange rate for ${currencyCode}: ${JSON.stringify(err)}`);
    }

    logger.warn(`Defaulting exchange rate to 1 for ${currencyCode}`);
    return 1;
}

export async function convertINRToLocalCurrency(
    amountINR: number,
    targetISO2: string,
    referencePPP: PPPInfo,
    opts?: { alpha?: number; minBaseINR?: number; capMultiplier?: number },
): Promise<{ convertedAmount: number; currencyCode: string }> {
    const options = {
        alpha: opts?.alpha ?? DEFAULT_ALPHA,
        minBaseINR: opts?.minBaseINR ?? DEFAULT_MIN_BASE_INR,
        capMultiplier: opts?.capMultiplier ?? DEFAULT_CAP_MULTIPLIER,
    };

    const numericCode = resolveNumericCountryCode(targetISO2);
    const currencyCode = resolveCurrencyCode(numericCode);
    const targetPPP = await resolvePPP(targetISO2);
    const exchangeRate = await getExchangeRateINRtoTargetCurrency(
        currencyCode,
        referencePPP,
        targetPPP,
    );

    const pppRatio = referencePPP.value / targetPPP.value;
    const finalAmount = calculateAdjustedPrice({
        amountINR,
        rate: exchangeRate,
        pppRatio,
        options,
    });

    const precision = getCurrencyPrecision(currencyCode) ?? 2;
    return {
        convertedAmount: roundToCharmPrice(finalAmount, precision),
        currencyCode,
    };
}

export async function convertToINR(
    amountForeign: number,
    currencyCode: CurrencyCode,
    targetCountryISO2: CountryCode2,
): Promise<number> {
    const referencePPP = await resolvePPP('IN');
    // --- PPP Fetch & Fallback ---
    const targetPPPResult = await resolvePPP(targetCountryISO2);
    const rate = await getExchangeRateINRtoTargetCurrency(
        currencyCode,
        {
            value: referencePPP.value,
            country: referencePPP.country,
        },
        {
            value: targetPPPResult.value,
            country: targetCountryISO2,
        },
    );

    if (typeof rate !== 'number' || isNaN(rate) || rate <= 0) {
        throw new Error(`Invalid or missing exchange rate for currency: ${currencyCode}`);
    }

    return Number((amountForeign / rate).toFixed(2));
}

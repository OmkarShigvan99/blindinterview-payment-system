import { z } from 'zod';
import currencyCodes from 'currency-codes';
import { CountryCode2, getCountryName } from './country.utils';
import { distance } from 'fastest-levenshtein';

export const currencyCodeSchema = z.enum([...currencyCodes.codes()] as [string, ...string[]], {
    required_error: 'Currency is required',
    invalid_type_error: `Currency must be valid  ${currencyCodes.codes()}`,
}); // Zod enum

export type CurrencyCode = z.infer<typeof currencyCodeSchema>;

export const toMajorUnit = (amountInMinor: number, currency: CurrencyCode): number => {
    const precision = getCurrencyPrecision(currency);
    if (typeof precision !== 'number') return amountInMinor;

    const multiplier = getCurrencyMultiplier(currency);
    if (typeof multiplier !== 'number' || multiplier <= 0) return amountInMinor;

    const factor = 10 ** precision;
    const value = amountInMinor / multiplier;

    return Math.floor(value * factor) / factor;
};

export const toMinorUnit = (amountInMajor: number, currency: CurrencyCode): number => {
    const multiplier = getCurrencyMultiplier(currency);
    if (typeof multiplier !== 'number' || multiplier <= 0) {
        return Math.round(amountInMajor);
    }

    const raw = amountInMajor * multiplier;
    return raw;
};

const STOP_WORDS = new Set(['the', 'of', 'and', 'republic', '&', 'islands', 'island']);

function normalizeCountryName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[\p{P}\p{S}]/gu, '') // Unicode-aware punctuation/symbol removal
        .trim()
        .split(/\s+/)
        .filter((word) => !STOP_WORDS.has(word))
        .sort()
        .join(' ')
        .trim();
}

// Helper function to find best string match using Levenshtein distance
function findBestMatch(
    target: string,
    candidates: string[],
): { bestMatch: { target: string; rating: number } } {
    let bestMatch = { target: '', rating: 0 };

    for (const candidate of candidates) {
        // Calculate similarity using Levenshtein distance
        const maxLength = Math.max(target.length, candidate.length);
        if (maxLength === 0) continue;

        const levenshteinDistance = distance(target, candidate);
        const similarity = 1 - levenshteinDistance / maxLength;

        if (similarity > bestMatch.rating) {
            bestMatch = { target: candidate, rating: similarity };
        }
    }

    return { bestMatch };
}

export function getCurrencyCode(country: CountryCode2): string | undefined {
    const countryName = getCountryName(country);

    if (!countryName) return undefined;

    const normalizedCountryName = normalizeCountryName(countryName);
    const allCountries = currencyCodes.countries();

    // Precompute a normalized map of country names.
    const normalizedMap = new Map<string, string>();
    for (const c of allCountries) {
        normalizedMap.set(normalizeCountryName(c), c);
    }

    // Handle known edge case
    if (countryName === 'Switzerland') {
        return 'CHF';
    }

    // 1. Exact match attempt
    if (normalizedMap.has(normalizedCountryName)) {
        const originalCountry = normalizedMap.get(normalizedCountryName)!;
        const result = currencyCodes.country(originalCountry);
        if (result && result.length > 0) {
            return result[0].code;
        }
    }

    // 2. Fuzzy match fallback
    const bestMatch = findBestMatch(normalizedCountryName, [...normalizedMap.keys()]).bestMatch;

    if (bestMatch.rating >= 0.4) {
        const bestMatchingCountry = normalizedMap.get(bestMatch.target)!;
        const result = currencyCodes.country(bestMatchingCountry);
        if (result && result.length > 0) {
            return result[0].code;
        }
    }

    return undefined;
}

export function getCurrencyPrecision(currency: string): number | undefined {
    return currencyCodes.code(currency)?.digits;
}

export function getCurrencyMultiplier(currency: string): number | undefined {
    const digits = currencyCodes.code(currency)?.digits;
    if (digits === undefined) return undefined;
    if (digits === 0) return 1;
    return 10 ** digits;
}

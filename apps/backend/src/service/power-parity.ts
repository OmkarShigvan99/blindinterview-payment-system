import type { CountryCode2 } from '@shared/utils/country.utils';
import { ENV } from '@src/config/env';
import type { PPPInfo } from '@src/utils/currency';
import { logger } from '@src/utils/logger';

export interface PPPApiResponseItem {
    indicator: { id: string; value: string };
    country: { id: string; value: string };
    countryiso3code: string;
    date: string;
    value: number | null;
    unit: string;
    obs_status: string;
    decimal: number;
}

export async function getLatestPPP(countryCode: CountryCode2): Promise<PPPInfo | undefined> {
    try {
        const res = await fetch(
            `${ENV.WORLD_BANK_API_LINK}/country/${countryCode}/indicator/PA.NUS.PPP?format=json&per_page=1`,
        );
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const [, data] = (await res.json()) as [unknown, PPPApiResponseItem[]];
        const { date, value } = data[0] ?? {};

        return typeof value === 'number' && value > 0
            ? { country: countryCode, year: Number(date) !== 0 ? Number(date) : 0, value }
            : undefined;
    } catch (err) {
        logger.warn(`PPP fetch error for ${countryCode}: ${JSON.stringify(err)}`);
        return undefined;
    }
}

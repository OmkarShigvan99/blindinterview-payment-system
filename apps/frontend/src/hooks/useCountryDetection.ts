// hooks/useCountryDetection.ts
import { useState, useEffect } from 'react';

interface CountryData {
    country: string; // Alpha2 code like "US", "GB", "IN"
    country_name: string; // Full country name
    currency: string; // Currency code like "USD", "EUR"
}

interface UseCountryDetectionReturn {
    countryCode: string;
    countryName: string;
    currency: string;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useCountryDetection = (): UseCountryDetectionReturn => {
    const [countryCode, setCountryCode] = useState<string>('US');
    const [countryName, setCountryName] = useState<string>('United States');
    const [currency, setCurrency] = useState<string>('USD');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCountryData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('https://ipapi.co/json/');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CountryData = await response.json();

            // Validate the response
            if (!data.country) {
                throw new Error('Invalid response: missing country data');
            }
            setCountryCode(data.country);
            setCountryName(data.country_name || 'Unknown');
            setCurrency(data.currency || 'USD');
            setLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to detect country';
            setError(errorMessage);
            console.error('Country detection error:', err);

            // Keep default values on error
            setCountryCode('US');
            setCountryName('United States');
            setCurrency('USD');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only run on client side
        if (typeof window !== 'undefined') {
            fetchCountryData();
        }
    }, []);

    const refetch = () => {
        fetchCountryData();
    };

    return {
        countryCode,
        countryName,
        currency,
        loading,
        error,
        refetch,
    };
};

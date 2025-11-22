import { PricingTierDTO } from '@shared/types/pricingTier';

export async function getServerSideUSPricing(): Promise<PricingTierDTO[]> {
    // Use the API URL from environment variables
    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';

    try {
        const response = await fetch(`${apiUrl}/pricing-tier/?country=US`, {
            headers: {
                'Content-Type': 'application/json',
            },
            // Add cache for better performance
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch US pricing tiers: ${response.status}`);
        }

        const data = await response.json();
        return data.data || data;
    } catch (error) {
        console.error('Error fetching server-side US pricing:', error);
        // Return fallback pricing tiers
        return [
            {
                name: 'free',
                description: 'Perfect for getting started',
                currency: 'USD',
                basePrice: 0,
                creditsIncluded: 100,
                expiryInDays: 30,
                isActive: true,
                features: ['100 credits', 'Basic support', 'Community access'],
            },
            {
                name: 'pro',
                description: 'For growing businesses',
                currency: 'USD',
                basePrice: 29,
                creditsIncluded: 1000,
                expiryInDays: 30,
                isActive: true,
                features: ['1000 credits', 'Priority support', 'Advanced features'],
            },
            {
                name: 'unlimited',
                description: 'For power users',
                currency: 'USD',
                basePrice: 99,
                creditsIncluded: 'unlimited',
                expiryInDays: 30,
                isActive: true,
                features: ['Unlimited credits', 'Premium support', 'All features'],
            },
            {
                name: 'elite',
                description: 'For enterprise',
                currency: 'USD',
                basePrice: 299,
                creditsIncluded: 'unlimited',
                expiryInDays: 'unlimited',
                isActive: true,
                features: ['Unlimited credits', 'Dedicated support', 'Custom integrations'],
            },
        ];
    }
}

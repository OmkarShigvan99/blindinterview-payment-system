export interface PricingTierDTO {
    name: string;
    description: string;
    currency: string;
    basePrice: number;
    creditsIncluded: number | 'unlimited';
    expiryInDays: number | 'unlimited';
    isActive: boolean;
    features: string[];
}

export enum Plans {
    FREE = 'free',
    PRO = 'pro',
    UNLIMITED = 'unlimited',
    ELITE = 'elite',
}

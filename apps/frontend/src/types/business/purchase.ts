/**
 * Business logic types for purchase flow
 */

import { OrderType } from '@shared/types/order';
import { Plans } from '@shared/types/pricingTier';
/**
 * Steps in the purchase flow
 */
export type Step = 'selection' | 'summary' | 'payment';

/**
 * Order summary data structure used in business logic
 */
export interface OrderSummary {
    basePrice: number;
    creditsIncluded: number | 'unlimited';
    credits: number | 'unlimited';
    currency: string;
    country: string;
    description: string;
    isActive: boolean;
    name: Plans;
    referencePPPCountry: string;
    referencePPPValue: number;
    referencePPPYear: string;
    type: OrderType;
    expiryInDays?: number | 'unlimited';
    features?: string[];
}

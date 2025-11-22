import type { IPricingTier, IPricingTierDocument } from '@src/model/pricing-tier.model';
import type { PricingTierDTO } from '@shared/types/pricingTier';

// TODO: unused
export function toPricingTierDTO(tier: IPricingTierDocument): PricingTierDTO {
    return {
        name: tier.name,
        description: tier.description,
        currency: tier.currency,
        basePrice: tier.basePrice,
        creditsIncluded: tier.creditsIncluded,
        expiryInDays: tier.expiryInDays,
        isActive: tier.isActive,
        features: tier.features,
    };
}

export function fromPricingTierDTO(
    dto: PricingTierDTO,
): Pick<
    IPricingTier,
    | 'name'
    | 'description'
    | 'currency'
    | 'basePrice'
    | 'creditsIncluded'
    | 'expiryInDays'
    | 'isActive'
    | 'features'
> {
    return {
        name: dto.name,
        description: dto.description,
        currency: dto.currency,
        basePrice: dto.basePrice,
        creditsIncluded: dto.creditsIncluded,
        expiryInDays: dto.expiryInDays,
        isActive: dto.isActive,
        features: dto.features,
    };
}

import type { PricingTierDTO } from '@shared/types/pricingTier';
import { fromPricingTierDTO } from '@src/mappers/pricingTier.mapper';
import { PricingTierModel } from '@src/model/pricing-tier.model';
import { getLatestPPP } from '@src/service/power-parity';
import { ApiResponse } from '@src/utils/api-response';
import { convertINRToLocalCurrency } from '@src/utils/currency';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PRICING_TIER_ERRORS } from '@src/constants';

export async function getPricingTiers(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    let { country } = req.query as { country: string };

    // set default to india if not provided
    country ??= 'US';

    const pricingTiers = await PricingTierModel.find();

    const convertedPricingTiers = await Promise.all(
        pricingTiers.map(async (pricingTier) => {
            const { convertedAmount, currencyCode } = await convertINRToLocalCurrency(
                pricingTier.basePrice,
                country,
                {
                    value: pricingTier.referencePPP.value,
                    country: pricingTier.referencePPP.country,
                },
                {
                    minBaseINR: pricingTier.basePrice,
                },
            );

            return {
                name: pricingTier.name,
                description: pricingTier.description,
                currency: currencyCode,
                basePrice: convertedAmount,
                creditsIncluded: pricingTier.creditsIncluded,
                expiryInDays: pricingTier.expiryInDays,
                isActive: pricingTier.isActive,
                features: pricingTier.features,
            };
        }),
    );

    res.status(StatusCodes.OK).json(
        new ApiResponse(true, 'Pricing tiers fetched successfully', convertedPricingTiers),
    );
}

export async function createPricingTier(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const pricingTier = req.body as PricingTierDTO;

    // find if the pricing tier already exists
    const existingPricingTier = await PricingTierModel.findOne({ name: pricingTier.name });

    if (existingPricingTier !== null) {
        res.status(StatusCodes.CONFLICT).json(
            new ApiResponse(false, PRICING_TIER_ERRORS.PRICING_TIER_ALREADY_EXISTS, {
                reason: 'Pricing tier already exists',
            }),
        );
        return;
    }

    // fetch the PP value and year for a country
    let pppInfo = await getLatestPPP('IN');

    if (pppInfo === undefined) {
        pppInfo = { country: 'IN', value: 20, year: 2024 };
    }

    // create new pricing tier
    const newPricingTier = await PricingTierModel.create({
        ...fromPricingTierDTO(pricingTier),
        referencePPP: { ...pppInfo },
    });

    res.json(new ApiResponse(true, 'Pricing tier created successfully', newPricingTier));
}

export async function updatePricingTier(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const pricingTier = req.body as PricingTierDTO;

    // updating the pricing tier
    const updatedPricingTier = await PricingTierModel.findOneAndUpdate(
        { name: pricingTier.name },
        fromPricingTierDTO(pricingTier),
        { new: true },
    );

    if (updatedPricingTier === null) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, PRICING_TIER_ERRORS.PRICING_TIER_NOT_FOUND, {
                reason: 'Pricing tier not found',
            }),
        );
        return;
    }

    res.json(new ApiResponse(true, 'Pricing tier updated successfully', updatedPricingTier));
}

export async function deletePricingTier(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const { name } = req.query as { name: string };

    const deletedPricingTier = await PricingTierModel.findOneAndDelete({ name });

    if (deletedPricingTier === null) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, PRICING_TIER_ERRORS.PRICING_TIER_NOT_FOUND, {
                reason: 'Pricing tier not found',
            }),
        );
        return;
    }

    res.json(new ApiResponse(true, 'Pricing tier deleted successfully', deletedPricingTier));
}

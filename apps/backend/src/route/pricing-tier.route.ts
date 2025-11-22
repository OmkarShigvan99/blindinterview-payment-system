import { validate } from '@src/middleware/validation.middleware';
import { Router, type Router as ExpressRouter } from 'express';
import type { ZodTypeAny } from 'zod';
import {
    deletePricingTierSchema,
    pricingTierSchema,
    updatePricingTierSchema,
} from '@shared/schemas/pricing-tier.schema';
import {
    createPricingTier,
    deletePricingTier,
    getPricingTiers,
    updatePricingTier,
} from '@src/controller/pricingTier.controller';
import { authenticateJwt, isAdmin } from '@src/middleware/auth.middleware';
import { catchAsync } from '@src/utils/catch-async';

export const pricingTierRouter: ExpressRouter = Router();

pricingTierRouter.get('/', catchAsync(getPricingTiers));

pricingTierRouter.post(
    '/add',
    validate(pricingTierSchema as ZodTypeAny, 'body'),
    authenticateJwt('access-jwt'),
    isAdmin,
    catchAsync(createPricingTier),
);

pricingTierRouter.patch(
    '/update',
    validate(updatePricingTierSchema as ZodTypeAny, 'body'),
    authenticateJwt('access-jwt'),
    isAdmin,
    catchAsync(updatePricingTier),
);

pricingTierRouter.delete(
    '/delete',
    validate(deletePricingTierSchema as ZodTypeAny, 'query'),
    authenticateJwt('access-jwt'),
    isAdmin,
    catchAsync(deletePricingTier),
);

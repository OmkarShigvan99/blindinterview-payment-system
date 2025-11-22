import { z } from "zod";
import { currencyCodeSchema } from "../utils/currency.utils";
import { countryCode2Schema } from "../utils/country.utils";

export const pricingTierSchema = z.object({
    name: z.string().min(1, "Tier name is required"),
    description: z.string().min(1, "Description is required"),
    currency: currencyCodeSchema, // e.g. INR, USD
    basePrice: z.number().nonnegative("Price must be non-negative"),
    creditsIncluded: z.union([
        z.number().int().nonnegative("Credits must be non-negative"),
        z.literal("unlimited", {
            description: "Credits are unlimited",
            invalid_type_error: "Credits must be 'unlimited'",
        }),
    ]),
    expiryInDays: z
        .union([
            z
                .number()
                .int()
                .gte(1, "Expiry must be at least 1 day")
                .lte(365, "Expiry cannot be more than 365 days"),
            z.literal("unlimited", {
                description: "Expiry is unlimited",
                invalid_type_error: "Expiry must be 'unlimited'",
            }),
        ])
        .default(30),
    referencePPPCountry: countryCode2Schema, // e.g. IN, US
    referencePPPValue: z
        .number()
        .positive("PPP value must be positive")
        .optional(),
    referencePPPYear: z
        .number()
        .int()
        .gte(2000, "Year must be >= 2000")
        .lte(new Date().getFullYear(), "Year cannot be in the future")
        .optional(),
    isActive: z.boolean(),
    features: z.array(z.string().min(1, "Feature is required")).optional(),
});

export const updatePricingTierSchema = pricingTierSchema.partial().extend({
    name: z.string().min(1, "Tier name is required"),
});

export const deletePricingTierSchema = z.object({
    name: z.string().min(1, "Tier name is required"),
});

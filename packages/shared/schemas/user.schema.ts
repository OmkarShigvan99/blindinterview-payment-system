import { z } from 'zod';
import { Plans } from '../types/pricingTier';

const passwordValidation = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, {
        message: 'Password must include at least one lowercase letter',
    })
    .regex(/[A-Z]/, {
        message: 'Password must include at least one uppercase letter',
    })
    .regex(/[0-9]/, {
        message: 'Password must include at least one number',
    })
    .regex(/[^a-zA-Z0-9]/, {
        message: 'Password must include at least one special character',
    });

const emailValidation = z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' })
    .transform((val) => val.toLowerCase().trim());

export const userRegistrationSchema = z
    .object({
        name: z
            .string()
            .min(1, { message: 'Name is required' })
            .max(50, { message: 'Name must be under 50 characters' }),

        email: emailValidation,

        password: passwordValidation,

        confirmPassword: z.string().min(1, { message: 'Confirm Password is required' }),

        acceptedTerms: z.boolean().refine((val) => val === true, {
            message: 'You must accept the Terms and Conditions to register',
        }),

        acceptedPrivacyPolicy: z.boolean().refine((val) => val === true, {
            message: 'You must accept the Privacy Policy to register',
        }),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: 'custom',
                path: ['confirmPassword'],
                message: 'Passwords do not match',
            });
        }
    });

export const userLoginSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
});

export const tokenSchema = z.object({
    'x-token': z.string().min(1, { message: 'Token is required' }).trim(),
});

export const resetPasswordSchema = z
    .object({
        newPassword: passwordValidation,
        confirmPassword: z.string().min(1, { message: 'Confirm Password is required' }),
    })
    .superRefine((data, ctx) => {
        if (data.newPassword !== data.confirmPassword) {
            ctx.addIssue({
                code: 'custom',
                path: ['confirmPassword'],
                message: 'Passwords do not match',
            });
        }
    });

export const emailVerificationSchema = z.object({
    email: emailValidation,
});

export const updateUserSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Name is required' })
        .max(50, { message: 'Name must be under 50 characters' })
        .optional(),
    email: emailValidation.optional(),
    credits: z.number().min(0).optional(),
    role: z.enum(['user', 'admin']).optional(),
    isEmailVerified: z.boolean().optional(),
    planType: z.enum([Plans.FREE, Plans.PRO, Plans.UNLIMITED, Plans.ELITE]).optional(),
    planExpiry: z
        .string()
        .superRefine((value, ctx) => {
            if (typeof value === 'undefined' || isNaN(Date.parse(value))) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['planExpiry'],
                    message: 'Subscription expiry is required and must be a valid date',
                });
            }
        })
        .optional(),
});

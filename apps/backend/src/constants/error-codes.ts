/**
 * Error codes used throughout the application
 * All error codes are in uppercase with underscores for consistency
 */

import { FORBIDDEN } from 'http-status-codes';

// Authentication & Authorization Error Codes
export const AUTH_ERRORS = {
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NO_CREDITS: 'NO_CREDITS',
    INVALID_CREDITS: 'INVALID_CREDITS',
} as const;

// Pricing Tier Error Codes
export const PRICING_TIER_ERRORS = {
    PRICING_TIER_ALREADY_EXISTS: 'PRICING_TIER_ALREADY_EXISTS',
    PRICING_TIER_NOT_FOUND: 'PRICING_TIER_NOT_FOUND',
} as const;

// Order & Payment Error Codes
export const ORDER_ERRORS = {
    ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
    ORDER_TYPE_NOT_FOUND: 'ORDER_TYPE_NOT_FOUND',
    PRICE_TIER_NOT_FOUND: 'PRICE_TIER_NOT_FOUND',
    PAYMENT_PROVIDER_NOT_SUPPORTED: 'PAYMENT_PROVIDER_NOT_SUPPORTED',
    PAYMENT_VERIFICATION_FAILED: 'PAYMENT_VERIFICATION_FAILED',
    PLAN_NAME_NOT_FOUND: 'PLAN_NAME_NOT_FOUND',
} as const;

// General Error Codes
export const GENERAL_ERRORS = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
} as const;

// Combined export of all error codes
export const ERROR_CODES = {
    ...AUTH_ERRORS,
    ...PRICING_TIER_ERRORS,
    ...ORDER_ERRORS,
    ...GENERAL_ERRORS,
} as const;

// Type for all error codes
export type ErrorCode = keyof typeof ERROR_CODES;

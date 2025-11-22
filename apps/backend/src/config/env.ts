import * as dotenv from 'dotenv';
import { resolve } from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';

// Calculate the backend root directory - works in all environments including Docker
function getBackendRootPath(): string {
    // Priority 1: Use environment variable if set (Docker-friendly)
    if (process.env.BACKEND_ROOT) {
        return resolve(process.env.BACKEND_ROOT);
    }

    // Priority 2: Auto-detect based on current location
    // In development: __dirname = "backend/src/config" or "/app/backend/src/config"
    // In production (compiled): __dirname = "backend/dist/backend/src/config" or "/app/backend/dist/backend/src/config"

    const isCompiled = __dirname.includes('dist');

    if (isCompiled) {
        // Production: find the backend directory by looking for the parent that contains dist
        let current = __dirname;
        while (current !== resolve(current, '..')) {
            if (current.endsWith('backend') && resolve(current, 'dist').includes(__dirname)) {
                return current;
            }
            current = resolve(current, '..');
        }
        // Fallback to old logic
        return resolve(__dirname, '../../../../');
    } else {
        // Development: find the backend directory by looking for package.json
        let current = __dirname;
        while (current !== resolve(current, '..')) {
            try {
                const packagePath = resolve(current, 'package.json');
                const fs = require('fs');
                if (fs.existsSync(packagePath)) {
                    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                    if (pkg.name === 'backend') {
                        return current;
                    }
                }
            } catch (e) {
                // Continue searching
            }
            current = resolve(current, '..');
        }
        // Fallback to old logic
        return resolve(__dirname, '../../');
    }
}

dotenv.config({ path: resolve(getBackendRootPath(), envFile) });

export const ENV = {
    APP_NAME:
        typeof process.env.APP_NAME === 'string' && process.env.APP_NAME.trim() !== ''
            ? process.env.APP_NAME
            : '',
    NODE_ENV:
        typeof process.env.NODE_ENV === 'string' && process.env.NODE_ENV.trim() !== ''
            ? process.env.NODE_ENV
            : 'development',
    PORT:
        typeof process.env.SERVER_PORT === 'string' && process.env.SERVER_PORT.trim() !== ''
            ? parseInt(process.env.SERVER_PORT, 10)
            : 3000,
    DATABASE_URL:
        typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.trim() !== ''
            ? process.env.DATABASE_URL
            : '',
    REDIS_URL:
        typeof process.env.REDIS_URL === 'string' && process.env.REDIS_URL.trim() !== ''
            ? process.env.REDIS_URL
            : '',
    REDIS_TOKEN:
        typeof process.env.REDIS_TOKEN === 'string' && process.env.REDIS_TOKEN.trim() !== ''
            ? process.env.REDIS_TOKEN
            : '',

    // JWT SECRETS
    JWT_ACCESS_SECRET:
        typeof process.env.JWT_ACCESS_SECRET === 'string' &&
        process.env.JWT_ACCESS_SECRET.trim() !== ''
            ? process.env.JWT_ACCESS_SECRET
            : '',
    JWT_ACCESS_EXPIRY: 60 * 60 * 12, // 12 hours
    JWT_REFRESH_SECRET:
        typeof process.env.JWT_REFRESH_SECRET === 'string' &&
        process.env.JWT_REFRESH_SECRET.trim() !== ''
            ? process.env.JWT_REFRESH_SECRET
            : '',
    JWT_REFRESH_EXPIRY: 60 * 60 * 24 * 7, // 7 days
    JWT_EMAIL_SECRET:
        typeof process.env.JWT_EMAIL_SECRET === 'string' &&
        process.env.JWT_EMAIL_SECRET.trim() !== ''
            ? process.env.JWT_EMAIL_SECRET
            : '',
    JWT_EMAIL_EXPIRY: 60 * 15, // 15 minutes
    JWT_FORGOT_PASSWORD_SECRET:
        typeof process.env.JWT_FORGOT_PASSWORD_SECRET === 'string' &&
        process.env.JWT_FORGOT_PASSWORD_SECRET.trim() !== ''
            ? process.env.JWT_FORGOT_PASSWORD_SECRET
            : '',
    JWT_FORGOT_PASSWORD_EXPIRY: 60 * 15, // 15 minutes

    // SMTP
    SMTP_EMAIL:
        typeof process.env.SMTP_EMAIL === 'string' && process.env.SMTP_EMAIL.trim() !== ''
            ? process.env.SMTP_EMAIL
            : '',
    SMTP_USERNAME:
        typeof process.env.SMTP_USERNAME === 'string' && process.env.SMTP_USERNAME.trim() !== ''
            ? process.env.SMTP_USERNAME
            : '',
    SMTP_PASSWORD:
        typeof process.env.SMTP_PASSWORD === 'string' && process.env.SMTP_PASSWORD.trim() !== ''
            ? process.env.SMTP_PASSWORD
            : '',
    SMTP_HOST:
        typeof process.env.SMTP_HOST === 'string' && process.env.SMTP_HOST.trim() !== ''
            ? process.env.SMTP_HOST
            : '',
    SMTP_PORT:
        typeof process.env.SMTP_PORT === 'string' && process.env.SMTP_PORT.trim() !== ''
            ? parseInt(process.env.SMTP_PORT, 10)
            : 587,
    FRONTEND_URL:
        typeof process.env.FRONTEND_URL === 'string' && process.env.FRONTEND_URL.trim() !== ''
            ? process.env.FRONTEND_URL
            : '',

    // RATE LIMITING CONFIGURATION
    // Express Rate Limiting (for general server protection)
    EXPRESS_RATE_LIMIT_ENABLED: process.env.EXPRESS_RATE_LIMIT_ENABLED === 'true',

    EXPRESS_RATE_LIMIT_WINDOW_MS:
        typeof process.env.EXPRESS_RATE_LIMIT_WINDOW_MS === 'string' &&
        process.env.EXPRESS_RATE_LIMIT_WINDOW_MS.trim() !== ''
            ? parseInt(process.env.EXPRESS_RATE_LIMIT_WINDOW_MS, 10)
            : 15 * 60 * 1000, // 15 minutes
    EXPRESS_RATE_LIMIT_MAX_REQUESTS:
        typeof process.env.EXPRESS_RATE_LIMIT_MAX_REQUESTS === 'string' &&
        process.env.EXPRESS_RATE_LIMIT_MAX_REQUESTS.trim() !== ''
            ? parseInt(process.env.EXPRESS_RATE_LIMIT_MAX_REQUESTS, 10)
            : 1000, // 1000 requests per window (much higher for development)
    RAZORPAY_KEY_ID:
        typeof process.env.RAZORPAY_KEY_ID === 'string' && process.env.RAZORPAY_KEY_ID.trim() !== ''
            ? process.env.RAZORPAY_KEY_ID
            : '',
    RAZORPAY_KEY_SECRET:
        typeof process.env.RAZORPAY_KEY_SECRET === 'string' &&
        process.env.RAZORPAY_KEY_SECRET.trim() !== ''
            ? process.env.RAZORPAY_KEY_SECRET
            : '',
    RAZORPAY_WEBHOOK_SECRET:
        typeof process.env.RAZORPAY_WEBHOOK_SECRET === 'string' &&
        process.env.RAZORPAY_WEBHOOK_SECRET.trim() !== ''
            ? process.env.RAZORPAY_WEBHOOK_SECRET
            : '',
    CASHFREE_APP_ID:
        typeof process.env.CASHFREE_APP_ID === 'string' && process.env.CASHFREE_APP_ID.trim() !== ''
            ? process.env.CASHFREE_APP_ID
            : '',
    CASHFREE_KEY_SECRET:
        typeof process.env.CASHFREE_KEY_SECRET === 'string' &&
        process.env.CASHFREE_KEY_SECRET.trim() !== ''
            ? process.env.CASHFREE_KEY_SECRET
            : '',
    WORLD_BANK_API_LINK:
        typeof process.env.WORLD_BANK_API_LINK === 'string' &&
        process.env.WORLD_BANK_API_LINK.trim() !== ''
            ? process.env.WORLD_BANK_API_LINK
            : '',
    EXCHANGE_RATE_API_LINK:
        typeof process.env.EXCHANGE_RATE_API_LINK === 'string' &&
        process.env.EXCHANGE_RATE_API_LINK.trim() !== ''
            ? process.env.EXCHANGE_RATE_API_LINK
            : '',
    EXCHANGE_RATE_API_KEY:
        typeof process.env.EXCHANGE_RATE_API_KEY === 'string' &&
        process.env.EXCHANGE_RATE_API_KEY.trim() !== ''
            ? process.env.EXCHANGE_RATE_API_KEY
            : '',

    // API KEY MANAGEMENT (for key rotation and rate limiting)
    API_KEY_COUNT:
        typeof process.env.API_KEY_COUNT === 'string' && process.env.API_KEY_COUNT.trim() !== ''
            ? parseInt(process.env.API_KEY_COUNT, 10)
            : 0,
    TOKEN_LIMIT:
        typeof process.env.TOKEN_LIMIT === 'string' && process.env.TOKEN_LIMIT.trim() !== ''
            ? parseInt(process.env.TOKEN_LIMIT, 10)
            : 1000000, // 1M tokens default
    SAFETY_BUFFER:
        typeof process.env.SAFETY_BUFFER === 'string' && process.env.SAFETY_BUFFER.trim() !== ''
            ? parseInt(process.env.SAFETY_BUFFER, 10)
            : 500, // 500 tokens safety buffer
    API_KEY_WINDOW_SIZE_MS:
        typeof process.env.API_KEY_WINDOW_SIZE_MS === 'string' &&
        process.env.API_KEY_WINDOW_SIZE_MS.trim() !== ''
            ? parseInt(process.env.API_KEY_WINDOW_SIZE_MS, 10)
            : 70 * 1000, // 70 seconds sliding window (converted to milliseconds)
    API_KEY_MAX_REQUESTS_PER_WINDOW:
        typeof process.env.API_KEY_MAX_REQUESTS_PER_WINDOW === 'string' &&
        process.env.API_KEY_MAX_REQUESTS_PER_WINDOW.trim() !== ''
            ? parseInt(process.env.API_KEY_MAX_REQUESTS_PER_WINDOW, 10)
            : 13, // 13 requests per window
    API_KEY_DAILY_LIMIT:
        typeof process.env.API_KEY_DAILY_LIMIT === 'string' &&
        process.env.API_KEY_DAILY_LIMIT.trim() !== ''
            ? parseInt(process.env.API_KEY_DAILY_LIMIT, 10)
            : 190, // 190 requests per day
};

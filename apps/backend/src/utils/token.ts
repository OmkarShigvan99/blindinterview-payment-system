import jwt from 'jsonwebtoken';
import { ENV } from '@src/config/env';

interface JwtPayload {
    id: string;
    email?: string; // optional for access/refresh; required for email verify
}

// === ACCESS TOKEN ===
export const generateAccessToken = (payload: JwtPayload): string => {
    const options: jwt.SignOptions = {
        expiresIn: ENV.JWT_ACCESS_EXPIRY,
    };

    return jwt.sign(payload, ENV.JWT_ACCESS_SECRET as jwt.Secret, options);
};

// === REFRESH TOKEN ===
export const generateRefreshToken = (payload: JwtPayload): string => {
    const options: jwt.SignOptions = {
        expiresIn: ENV.JWT_REFRESH_EXPIRY,
    };
    return jwt.sign(payload, ENV.JWT_REFRESH_SECRET as jwt.Secret, options);
};

// === FORGOT PASSWORD TOKEN ===
export const generateForgotPasswordToken = (payload: JwtPayload): string => {
    const options: jwt.SignOptions = {
        expiresIn: ENV.JWT_FORGOT_PASSWORD_EXPIRY,
    };
    return jwt.sign(payload, ENV.JWT_FORGOT_PASSWORD_SECRET as jwt.Secret, options);
};

// === EMAIL VERIFICATION TOKEN ===
export const generateEmailVerificationToken = (payload: JwtPayload): string => {
    const options: jwt.SignOptions = {
        expiresIn: ENV.JWT_EMAIL_EXPIRY,
    };
    return jwt.sign(payload, ENV.JWT_EMAIL_SECRET as jwt.Secret, options);
};

import { ApiResponse } from '@src/utils/api-response';
import type { NextFunction, Request, Response } from 'express';
import type { UserDTO } from '@shared/types/user';
import { UserModel } from '@src/model/user.model';
import { StatusCodes } from 'http-status-codes';
import type { JwtPayload } from 'jsonwebtoken';
import {
    createEmailVerificationTemplate,
    createResetPasswordTemplate,
    sendMail,
} from '@src/service/mail';
import { toUserDTO } from '@src/mappers/user.mapper';
import { AUTH_ERRORS } from '@src/constants';
import { logger } from '@src/utils/logger';

export async function registerUser(
    req: Request<
        any,
        any,
        {
            name: string;
            email: string;
            password: string;
            confirmPassword: string;
            acceptedTerms: boolean;
            acceptedPrivacyPolicy: boolean;
        }
    >,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const { name, email, password, acceptedTerms, acceptedPrivacyPolicy } = req.body;

    // check if the user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser !== null) {
        res.status(StatusCodes.CONFLICT).json(
            new ApiResponse(false, AUTH_ERRORS.USER_ALREADY_EXISTS, {
                reason: 'User already exists',
            }),
        );
        return;
    }

    const user = await UserModel.create({
        name,
        email,
        password,
        acceptedTerms,
        acceptedTermsAt: acceptedTerms ? new Date() : undefined,
        acceptedPrivacyPolicy,
        acceptedPrivacyPolicyAt: acceptedPrivacyPolicy ? new Date() : undefined,
    });

    // Log terms and privacy policy acceptance for audit purposes
    logger.info('User registration with terms and privacy policy acceptance', {
        userId: user._id,
        userEmail: email,
        userName: name,
        acceptedTerms,
        acceptedTermsAt: acceptedTerms ? new Date().toISOString() : null,
        acceptedPrivacyPolicy,
        acceptedPrivacyPolicyAt: acceptedPrivacyPolicy ? new Date().toISOString() : null,
        timestamp: new Date().toISOString(),
    });

    // generate email verification token
    user.emailVerificationToken = user.generateEmailVerificationToken();

    // Send verification email
    const emailBody = createEmailVerificationTemplate(user.name, user.emailVerificationToken);
    await sendMail(user.email, 'Email Verification', emailBody);

    res.status(StatusCodes.CREATED).json(
        new ApiResponse<UserDTO>(true, 'User registered successfully', toUserDTO(user)),
    );
}

export async function loginUser(
    req: Request<
        any,
        any,
        {
            email: string;
            password: string;
        }
    >,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user === null) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, AUTH_ERRORS.USER_NOT_FOUND, {
                reason: 'User not found',
            }),
        );
        return;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        res.status(StatusCodes.UNAUTHORIZED).json(
            new ApiResponse(false, AUTH_ERRORS.INVALID_CREDENTIALS, {
                reason: 'Password is incorrect',
            }),
        );
        return;
    }

    // generate access and refresh tokens
    const { accessToken, refreshToken } = user.generateTokens();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    const updatedUser = await user.save();

    // set cookies
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });

    res.status(StatusCodes.OK).json(
        new ApiResponse<UserDTO>(true, 'User logged in successfully', toUserDTO(updatedUser)),
    );
}

export async function logoutUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(StatusCodes.OK).json(new ApiResponse(true, 'User logged out successfully', null));
}

export async function sendVerificationEmail(
    req: Request & { user?: { email?: string } },
    res: Response,
    next: NextFunction,
): Promise<void> {
    if (req.user === undefined || req.user === null) {
        res.status(StatusCodes.UNAUTHORIZED).json(
            new ApiResponse(false, AUTH_ERRORS.UNAUTHORIZED, {
                reason: 'User is not logged in',
            }),
        );
        return;
    }

    if (req.user?.email === undefined || req.user?.email === null) {
        res.status(StatusCodes.UNAUTHORIZED).json(
            new ApiResponse(false, AUTH_ERRORS.UNAUTHORIZED, {
                reason: 'User is not logged in',
            }),
        );
        return;
    }

    const email = req.user.email;

    // find user by email
    const user = await UserModel.findOne({ email });

    if (user === null) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, AUTH_ERRORS.USER_NOT_FOUND, {
                reason: 'No user found with this email',
            }),
        );
        return;
    }

    // generate email verification token
    user.emailVerificationToken = user.generateEmailVerificationToken();

    // Send verification email
    const emailBody = createEmailVerificationTemplate(user.name, user.emailVerificationToken);
    await sendMail(user.email, 'Email Verification', emailBody);

    res.json(
        new ApiResponse(true, 'Verification email sent successfully', {
            email: user.email,
        }),
    );
}

export async function sendPasswordResetEmail(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const { email } = req.body;

    // find user by email
    const user = await UserModel.findOne({ email });

    if (user === null) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, AUTH_ERRORS.USER_NOT_FOUND, {
                reason: 'No user found with this email',
            }),
        );
        return;
    }

    // generate password reset token
    user.forgotPasswordToken = user.generateForgotPasswordToken();

    // Send password reset email
    const emailBody = createResetPasswordTemplate(user.name, user.forgotPasswordToken);
    await sendMail(user.email, 'Password Reset', emailBody);

    res.status(StatusCodes.OK).json(
        new ApiResponse(true, 'Password reset email sent successfully', null),
    );
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.user as JwtPayload;

    // find user by email
    const user = await UserModel.findOne({ email });

    if (user === null) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, AUTH_ERRORS.USER_NOT_FOUND, {
                reason: 'No user found with this email',
            }),
        );
        return;
    }

    if (user.isEmailVerified) {
        res.status(StatusCodes.OK).json(
            new ApiResponse(true, 'Email already verified', {
                email: user.email,
            }),
        );
        return;
    }

    user.isEmailVerified = true;
    await user.save();

    res.status(StatusCodes.OK).json(new ApiResponse(true, 'Email verified successfully', null));
}

export async function resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const { newPassword } = req.body;

    // find user by email
    const user = await UserModel.findOne({ email: req.user?.email });

    if (user === null) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, AUTH_ERRORS.USER_NOT_FOUND, {
                reason: 'No user found with this email',
            }),
        );
        return;
    }

    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json(new ApiResponse(true, 'Password reset successfully', null));
}

export async function refreshAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const { email } = req.user as JwtPayload;

    const user = await UserModel.findOne({ email });

    if (user === null) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, AUTH_ERRORS.USER_NOT_FOUND, {
                reason: 'No user found with this email',
            }),
        );
        return;
    }

    const { accessToken, refreshToken } = user.generateTokens();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save();

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });

    res.status(StatusCodes.OK).json(
        new ApiResponse<UserDTO>(true, 'Access token refreshed successfully', toUserDTO(user)),
    );
}

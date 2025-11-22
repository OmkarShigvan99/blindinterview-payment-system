import passport from 'passport';
import type { Request, Response, NextFunction, Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '@src/utils/api-response';
import { AUTH_ERRORS } from '@src/constants';

export const authenticateJwt =
    (strategy: string) => (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            strategy,
            { session: false },
            (
                err: unknown,
                user: boolean | Express.User,
                info: { name: string; message: string | string[] },
            ) => {
                if (err !== null) {
                    next(err);
                    return;
                }

                if (user === false) {
                    const isExpired =
                        info.name === 'TokenExpiredError' || info.message.includes('jwt expired');

                    return res.status(StatusCodes.UNAUTHORIZED).json(
                        new ApiResponse(false, AUTH_ERRORS.UNAUTHORIZED, {
                            reason: isExpired ? 'Token expired' : 'Invalid token',
                        }),
                    );
                }

                req.user = user as Express.User;
                next();
            },
        )(req, res, next);
    };

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'admin') {
        res.status(StatusCodes.FORBIDDEN).json(
            new ApiResponse(false, AUTH_ERRORS.FORBIDDEN, { reason: 'You are not an admin' }),
        );
        return;
    }

    next();
};

export const isEmailVerified = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.isEmailVerified !== true) {
        res.status(StatusCodes.FORBIDDEN).json(
            new ApiResponse(false, AUTH_ERRORS.FORBIDDEN, {
                reason: 'Email is not verified. Please verify your email',
            }),
        );
        return;
    }

    next();
};

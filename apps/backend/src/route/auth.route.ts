import {
    registerUser,
    loginUser,
    logoutUser,
    sendVerificationEmail,
    sendPasswordResetEmail,
    resetPassword,
    verifyEmail,
    refreshAccessToken,
} from '@src/controller/auth.controller';
import { validate } from '@src/middleware/validation.middleware';
import { Router, type Router as ExpressRouter } from 'express';
import {
    emailVerificationSchema,
    resetPasswordSchema,
    tokenSchema,
    userLoginSchema,
    userRegistrationSchema,
} from '@shared/schemas/user.schema';
import type { ZodTypeAny } from 'zod';
import { catchAsync } from '@src/utils/catch-async';
import type { RequestHandler } from 'express';
import { authenticateJwt } from '@src/middleware/auth.middleware';

const authRouter: ExpressRouter = Router();

authRouter.post(
    '/register',
    validate(userRegistrationSchema as ZodTypeAny, 'body'),
    catchAsync(registerUser),
);
authRouter.post('/login', validate(userLoginSchema as ZodTypeAny, 'body'), catchAsync(loginUser));
authRouter.get('/logout', authenticateJwt('access-jwt') as RequestHandler, catchAsync(logoutUser));

authRouter.post(
    '/send-verification-email',
    authenticateJwt('access-jwt') as RequestHandler,
    catchAsync(sendVerificationEmail),
);

authRouter.post(
    '/send-password-reset-email',
    validate(emailVerificationSchema as ZodTypeAny, 'body'),
    catchAsync(sendPasswordResetEmail),
);

authRouter.post(
    '/reset-password',
    validate(tokenSchema as ZodTypeAny, 'headers'),
    validate(resetPasswordSchema as ZodTypeAny, 'body'),
    authenticateJwt('reset-forgot-password-jwt') as RequestHandler,
    catchAsync(resetPassword),
);

authRouter.post(
    '/verify-email',
    validate(tokenSchema as ZodTypeAny, 'headers'),
    authenticateJwt('email-jwt') as RequestHandler,
    catchAsync(verifyEmail),
);

authRouter.post(
    '/refresh-access-token',
    authenticateJwt('refresh-jwt') as RequestHandler,
    catchAsync(refreshAccessToken),
);

// test authenticated route
authRouter.get('/protected', authenticateJwt('access-jwt') as RequestHandler, (_req, res) => {
    res.json({ status: 'ok' });
});

export default authRouter;

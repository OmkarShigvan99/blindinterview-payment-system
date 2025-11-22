import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { ENV } from '@src/config/env'; // e.g. 'development' or 'production'
import type { Express } from 'express';

export const applySecurityMiddleware = (app: Express): void => {
    app.use(
        cors({
            origin: ENV.FRONTEND_URL,
            credentials: true,
        }),
    );

    if (ENV.NODE_ENV === 'production') {
        app.use(helmet());
        app.use(compression());
        app.use(
            rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 100,
                message: 'Too many requests. Please try again later.',
            }),
        );
    }
};

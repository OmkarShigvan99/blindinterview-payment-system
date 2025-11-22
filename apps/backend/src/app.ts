import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRouter from './route/auth.route';
import { applySecurityMiddleware } from './middleware/security-middleware';
import { globalErrorHandler } from './middleware/error-handler.middleware';
import { accessJwtStrategy, refreshJwtStrategy, formStrategy } from './config/strategy';
import { orderRouter } from './route/order.route';
import { webhooksRouter } from './route/webhooks.route';
import { pricingTierRouter } from './route/pricing-tier.route';
import { userRouter } from './route/user.route';
import { creditsRouter } from './route/credits.route';
import { apiKeysRouter } from './route/apikeys.route';

// create express app
const app: Express = express();

// set up basic express configuration
const rawBodyPaths = ['/api/webhooks/razorpay', '/api/webhooks/cashfree'];

app.use((req, res, next) => {
    if (rawBodyPaths.includes(req.originalUrl)) {
        express.raw({ type: 'application/json' })(req, res, next);
    } else {
        express.json()(req, res, next);
    }
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// set up security middleware
applySecurityMiddleware(app);

// set up passport middleware
passport.use('access-jwt', accessJwtStrategy);
passport.use('refresh-jwt', refreshJwtStrategy);
passport.use('email-jwt', formStrategy('email'));
passport.use('reset-forgot-password-jwt', formStrategy('reset-forgot-password'));
app.use(passport.initialize());

// set up routes
app.use('/api/auth', authRouter);
app.use('/api/order', orderRouter);
app.use('/api/pricing-tier', pricingTierRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/user', userRouter);
app.use('/api/credits', creditsRouter);
app.use('/api/apikeys', apiKeysRouter);

// health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use(globalErrorHandler);

export default app;

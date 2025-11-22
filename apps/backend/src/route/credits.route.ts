import { updateTokensSchema } from '@shared/schemas/apikeys.schema';
import { decrementCredits } from '@src/controller/credits.controller';
import { authenticateJwt } from '@src/middleware/auth.middleware';
import { validate } from '@src/middleware/validation.middleware';
import { catchAsync } from '@src/utils/catch-async';
import { Router, type Router as ExpressRouter } from 'express';
import { ZodTypeAny } from 'zod';

const router: ExpressRouter = Router();

router.post(
    '/decrement',
    validate(updateTokensSchema as ZodTypeAny, 'body'),
    authenticateJwt('access-jwt'),
    catchAsync(decrementCredits),
);

export { router as creditsRouter };

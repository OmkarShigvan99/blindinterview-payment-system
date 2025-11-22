import { Router, type Router as ExpressRouter } from 'express';
import { catchAsync } from '@src/utils/catch-async';
import { authenticateJwt } from '@src/middleware/auth.middleware';
import { validate } from '@src/middleware/validation.middleware';
import { getApiKeysIndex, getApiKeyStats } from '@src/controller/apikeys.controller';
import { updateTokensSchema } from '@shared/schemas/apikeys.schema';
import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

const apiKeysRouter: ExpressRouter = Router();

// Get available API key index (requires authentication)
apiKeysRouter.get(
    '/get-index',
    authenticateJwt('access-jwt') as RequestHandler,
    catchAsync(getApiKeysIndex),
);

// Get API key statistics (requires authentication)
apiKeysRouter.get(
    '/stats',
    authenticateJwt('access-jwt') as RequestHandler,
    catchAsync(getApiKeyStats),
);

export { apiKeysRouter };

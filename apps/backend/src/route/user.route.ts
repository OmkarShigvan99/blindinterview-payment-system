import { Router, type Router as ExpressRouter } from 'express';
import { getAllUsers, getUser, updateUser, deleteUser } from '@src/controller/user.controller';
import { authenticateJwt, isAdmin } from '@src/middleware/auth.middleware';
import { catchAsync } from '@src/utils/catch-async';
import { validate } from '@src/middleware/validation.middleware';
import { idSchema } from '@src/schema/general.schema';
import type { ZodTypeAny } from 'zod';
import { updateUserSchema } from '@shared/schemas/user.schema';

const router: ExpressRouter = Router();

router.route('/').get(authenticateJwt('access-jwt'), isAdmin, catchAsync(getAllUsers));
router
    .route('/:id')
    .get(
        validate(idSchema as ZodTypeAny, 'params'),
        authenticateJwt('access-jwt'),
        catchAsync(getUser),
    )
    .patch(
        validate(idSchema as ZodTypeAny, 'params'),
        validate(updateUserSchema as ZodTypeAny, 'body'),
        authenticateJwt('access-jwt'),
        isAdmin,
        catchAsync(updateUser),
    )
    .delete(
        validate(idSchema as ZodTypeAny, 'params'),
        authenticateJwt('access-jwt'),
        isAdmin,
        catchAsync(deleteUser),
    );

export { router as userRouter };

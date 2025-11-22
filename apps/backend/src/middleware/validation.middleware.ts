import type { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { logger } from '@src/utils/logger';
import { ApiResponse } from '@src/utils/api-response';
import { GENERAL_ERRORS } from '@src/constants';

type ValidationSource = 'body' | 'query' | 'params' | 'cookies' | 'headers';

export const validate =
    (schema: z.ZodTypeAny, source: ValidationSource = 'body') =>
    (req: Request, res: Response, next: NextFunction): void => {
        try {
            const dataToValidate =
                source === 'headers'
                    ? Object.fromEntries(
                          Object.entries(req.headers).map(([k, v]) => [k.toLowerCase(), v]),
                      )
                    : req[source];

            const validationResult = schema.safeParse(dataToValidate);

            if (validationResult.success) {
                next();
            } else {
                logger.error(validationResult.error.message);
                const errorMessages = validationResult.error.errors.map((error) => ({
                    path: error.path[0],
                    message: error.message,
                }));

                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(false, GENERAL_ERRORS.VALIDATION_ERROR, {
                        reason: errorMessages
                            .map((error) => error.path + ': ' + error.message)
                            .join(', '),
                    }),
                );
            }
        } catch (error) {
            next(error);
        }
    };

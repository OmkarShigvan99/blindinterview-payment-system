import { ApiResponse } from '@src/utils/api-response';
import { logger } from '@src/utils/logger';
import type { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GENERAL_ERRORS } from '@src/constants';
import util from 'util'; // ✅ Required to safely inspect error objects

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    if (err instanceof Error) {
        logger.error(`💥 Global Error: ${err.stack}`);
    } else {
        logger.error(`💥 Global Error: ${util.inspect(err, { depth: null })}`);
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        new ApiResponse(false, GENERAL_ERRORS.SERVER_ERROR, {
            reason: 'Something went wrong',
        }),
    );
};

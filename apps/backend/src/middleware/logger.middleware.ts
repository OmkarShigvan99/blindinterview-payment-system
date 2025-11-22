// src/middleware/loggerMiddleware.ts
import type { Request, Response, NextFunction } from 'express';
import { logger } from '@src/utils/logger';

// TODO: unused
export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
    logger.info(`[${req.method}] ${req.originalUrl}`);
    next();
};

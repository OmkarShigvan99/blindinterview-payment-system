import type { Request, Response, NextFunction } from 'express';

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const catchAsync =
    (fn: AsyncRouteHandler) => (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };

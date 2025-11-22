import { NextFunction, Request, Response } from 'express';
import { initRedis } from '@src/database/redis';
import { ENV } from '@src/config/env';
import { logger } from '@src/utils/logger';
import { ApiResponse } from '@src/utils/api-response';
import { StatusCodes } from 'http-status-codes';
import { checkTokenUsed, getApiKeyIndexAdvanced, getApiKeysStats } from '@src/utils/key-management';

const {
    TOKEN_LIMIT,
    SAFETY_BUFFER,
    API_KEY_COUNT,
    API_KEY_WINDOW_SIZE_MS,
    API_KEY_MAX_REQUESTS_PER_WINDOW,
    API_KEY_DAILY_LIMIT,
} = ENV;

export async function getApiKeysIndex(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        logger.info('API key index request received');

        const apiKeyIndex = await getApiKeyIndexAdvanced();

        if (apiKeyIndex === -1) {
            res.status(StatusCodes.TOO_MANY_REQUESTS).json(
                ApiResponse.error(
                    'All API keys are currently at their rate limit or token limit. Please try again later.',
                ),
            );
            return;
        }

        res.status(200).json(
            ApiResponse.success(
                {
                    apiKeyIndex,
                    timestamp: new Date().toISOString(),
                },
                'API key index retrieved successfully',
            ),
        );
    } catch (error) {
        logger.error('Error in getApiKeysIndex:', error);
        next(error);
    }
}

export async function getApiKeyStats(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const stats = await getApiKeysStats();

    res.status(StatusCodes.OK).json(
        ApiResponse.success(
            {
                stats,
                config: {
                    totalApiKeys: API_KEY_COUNT,
                    tokenLimit: TOKEN_LIMIT,
                    safetyBuffer: SAFETY_BUFFER,
                    windowSize: API_KEY_WINDOW_SIZE_MS,
                    maxRequestsPerWindow: API_KEY_MAX_REQUESTS_PER_WINDOW,
                    dailyLimit: API_KEY_DAILY_LIMIT,
                },
            },
            'API key statistics retrieved successfully',
        ),
    );
}

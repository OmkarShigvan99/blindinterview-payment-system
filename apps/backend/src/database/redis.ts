import { ENV } from '@src/config/env';
import { logger } from '@src/utils/logger';
import { Redis } from '@upstash/redis';

let redisClient: Redis | null = null;

export async function initRedis(): Promise<Redis> {
    if (redisClient) {
        return redisClient;
    }

    try {
        // Create Upstash Redis client
        const config: any = {
            url: ENV.REDIS_URL,
        };

        // Add token if provided (required for Upstash)
        if (ENV.REDIS_TOKEN) {
            config.token = ENV.REDIS_TOKEN;
        }

        redisClient = new Redis(config);

        // Test the connection
        const testResult = await redisClient.ping();
        if (testResult === 'PONG') {
            logger.info('✅ Redis Connection Established');
        } else {
            throw new Error('Redis ping failed');
        }

        return redisClient;
    } catch (error) {
        logger.error('❌ Redis initialization failed:', error);
        throw error;
    }
}

export function getRedisClient(): Redis | null {
    return redisClient;
}

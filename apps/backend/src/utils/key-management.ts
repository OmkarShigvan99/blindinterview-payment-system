import { initRedis } from '@src/database/redis';
import { logger } from './logger';
import { ENV } from '@src/config/env';

let redisClient: Awaited<ReturnType<typeof initRedis>> | null = null;

async function getRedisClient() {
    if (!redisClient) {
        redisClient = await initRedis();
    }
    return redisClient;
}

export async function checkTokenUsed(index: number): Promise<number> {
    try {
        const client = await getRedisClient();
        const tokens = await client.get(`key:${index}:tokens`);
        return parseInt((tokens as string) || '0', 10);
    } catch (error) {
        logger.error(`Error checking token usage for index ${index}:`, error);
        return 0;
    }
}

export async function incrementTokens(index: number, tokens: number): Promise<void> {
    try {
        const client = await getRedisClient();
        // Upstash Redis doesn't have multi/pipeline in the same way
        await client.incrby(`key:${index}:tokens`, tokens);
        await client.expire(`key:${index}:tokens`, 86400); // Reset after 24 hours
    } catch (error) {
        logger.error(`Error incrementing tokens for index ${index}:`, error);
    }
}

export async function getApiKeyIndexAdvanced(): Promise<number> {
    if (ENV.API_KEY_COUNT === 0) {
        logger.warn('No API keys configured (API_KEY_COUNT is 0)');
        return -1;
    }

    let i = 0;
    const maxAttempts = ENV.API_KEY_COUNT * 2; // Prevent infinite loops
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const client = await getRedisClient();
            const now = Date.now() / 1000; // Current timestamp in seconds
            const tokenUsed = await checkTokenUsed(i);
            const usageCountKey = `key:${i}:usageCount`;
            const redisKey = `key:${i}:sliding_log`;

            // Remove old entries from sliding window
            await client.zremrangebyscore(redisKey, 0, now - ENV.API_KEY_WINDOW_SIZE_MS / 1000);

            // Count recent requests in the window
            const reqCount = await client.zcount(
                redisKey,
                now - ENV.API_KEY_WINDOW_SIZE_MS / 1000,
                now,
            );

            // Get daily usage count
            const usageDailyStr = await client.get(usageCountKey);
            const usageDaily = parseInt((usageDailyStr as string) || '0', 10);

            logger.debug(
                `API Key ${i}: reqCount=${reqCount}, tokenUsed=${tokenUsed}, usageDaily=${usageDaily}`,
            );

            // Check if this API key is available
            const withinRateLimit = reqCount < ENV.API_KEY_MAX_REQUESTS_PER_WINDOW;
            const withinTokenLimit = tokenUsed + ENV.SAFETY_BUFFER < ENV.TOKEN_LIMIT;
            const withinDailyLimit = usageDaily < ENV.API_KEY_DAILY_LIMIT;

            if (withinRateLimit && withinTokenLimit && withinDailyLimit) {
                // Add current request timestamp to sliding window
                await client.zadd(redisKey, { score: now, member: now.toString() });
                await client.expire(redisKey, 86400); // Expire after 24 hours

                // Track daily usage
                await client.incr(usageCountKey);
                await client.expire(usageCountKey, 86400); // Reset daily counter after 24 hours

                logger.info(`Selected API key index: ${i}`);
                return i;
            }

            // Move to next API key
            i = (i + 1) % ENV.API_KEY_COUNT;
            attempts++;

            // If we've cycled through all keys once, add a small delay
            if (attempts % ENV.API_KEY_COUNT === 0 && attempts < maxAttempts) {
                logger.debug('All API keys at limit, waiting 1 second before retry...');
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        } catch (error) {
            logger.error(`Error processing API key index ${i}:`, error);
            i = (i + 1) % ENV.API_KEY_COUNT;
            attempts++;
        }
    }

    logger.warn('No available API keys found after maximum attempts');
    return -1;
}

export async function updateTokens(index: number, tokens: number): Promise<void> {
    try {
        await incrementTokens(index, tokens);
        logger.info(`Updated tokens for API key ${index}: +${tokens} tokens`);
    } catch (error) {
        logger.error(`Failed to update tokens for API key ${index}:`, error);
        throw error;
    }
}

export async function getApiKeysStats(): Promise<
    {
        index: number;
        tokensUsed: number;
        tokensRemaining: number;
        usageDaily: number;
        currentWindowRequests: number;
        dailyLimitRemaining: number;
        windowLimitRemaining: number;
    }[]
> {
    const stats = [];

    for (let i = 0; i < ENV.API_KEY_COUNT; i++) {
        const client = await getRedisClient();
        const tokensUsed = await checkTokenUsed(i);
        const usageDaily = parseInt(
            ((await client.get(`key:${i}:usageCount`)) as string) || '0',
            10,
        );
        const now = Date.now() / 1000;
        const redisKey = `key:${i}:sliding_log`;

        // Remove old entries and count current window
        await client.zremrangebyscore(redisKey, 0, now - ENV.API_KEY_WINDOW_SIZE_MS / 1000);
        const currentWindowRequests = await client.zcount(
            redisKey,
            now - ENV.API_KEY_WINDOW_SIZE_MS / 1000,
            now,
        );

        stats.push({
            index: i,
            tokensUsed,
            tokensRemaining: ENV.TOKEN_LIMIT - tokensUsed,
            usageDaily,
            currentWindowRequests:
                typeof currentWindowRequests === 'number' ? currentWindowRequests : 0,
            dailyLimitRemaining: ENV.API_KEY_DAILY_LIMIT - usageDaily,
            windowLimitRemaining:
                ENV.API_KEY_MAX_REQUESTS_PER_WINDOW -
                (typeof currentWindowRequests === 'number' ? currentWindowRequests : 0),
        });
    }

    return stats;
}

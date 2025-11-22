import connectToDatabase from '@src/database/connection';
import app from '@src/app';
import { ENV } from '@src/config/env';
import { logger } from './utils/logger';
import { getExchangeRate } from './service/exchange-rate';
import { initRedis } from './database/redis';

async function init(): Promise<void> {
    try {
        await connectToDatabase();
        await getExchangeRate('INR');
        await initRedis();
        app.listen(ENV.PORT, () => {
            logger.info(`🚀 Server started on port ${ENV.PORT}`);
        });
    } catch (err) {
        logger.error('❌ Failed to connect to database. Server not started.', err);
        process.exit(1);
    }
}

init().catch((error) => {
    logger.error('Error starting server', error);
});

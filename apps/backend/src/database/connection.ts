import { connect } from 'mongoose';
import { ENV } from '@src/config/env';
import { logger } from '@src/utils/logger';

async function connectToDatabase(): Promise<void> {
    await connect(ENV.DATABASE_URL);
    logger.info('✅ Database connected');
}

export default connectToDatabase;

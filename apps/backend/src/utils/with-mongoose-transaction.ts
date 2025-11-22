import mongoose from 'mongoose';
import { logger } from './logger';

const JSON_INDENT_SPACES = 2;

export async function withMongooseTransaction(
    fn: (session: mongoose.ClientSession) => Promise<void>,
): Promise<void> {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            await fn(session);
        });
    } catch (error) {
        logger.error(`Error:\n${JSON.stringify(error, null, JSON_INDENT_SPACES)}`);
        throw error;
    } finally {
        await session.endSession();
    }
}

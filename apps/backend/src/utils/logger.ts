import winston from 'winston';
import path from 'node:path';
import { ENV } from '@src/config/env';

const logDir = 'logs';

export const logger = winston.createLogger({
    level: ENV.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
            const message = String(info.message);
            const baseMessage = `[${message}] ${info.level.toUpperCase()}:`;
            if (typeof info.stack === 'string' && info.stack.length > 0) {
                return `${baseMessage} ${info.stack}`;
            }
            return `${baseMessage} ${message}`;
        }),
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
    ],
});

if (ENV.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console());
}

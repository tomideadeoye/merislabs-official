import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface LogContext {
  [key: string]: any;
}

const customFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}] ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

export const log = (level: LogLevel, message: string, context?: LogContext) => {
  logger.log(level, message, context);
};

export const debug = (message: string, context?: LogContext) => {
  log('debug', message, context);
};

export const info = (message: string, context?: LogContext) => {
  log('info', message, context);
};

export const warn = (message: string, context?: LogContext) => {
  log('warn', message, context);
};

export const error = (message: string, context?: LogContext) => {
  log('error', message, context);
};

export const success = (message: string, context?: LogContext) => {
  log('info', `✅ ${message}`, context);
};

export { logger };

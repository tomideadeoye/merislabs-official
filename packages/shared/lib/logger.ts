/**
 * Enhanced Logger for Orion
 * Combines Winston for production logging with stylish console output for development.
 *
 * Features:
 * - Color-coded output with icons in development
 * - Winston-based structured logging in production
 * - Development/Production mode awareness
 * - Singleton pattern for consistent logging
 * - Structured context logging
 * - Production error service integration ready
 * - Additional log levels (success)
 * - Timestamp and log level indicators
 */

import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface LogContext {
  [key: string]: any;
}

const LOG_STYLES: Record<LogLevel, { color: string; icon: string; consoleMethod: 'debug' | 'info' | 'warn' | 'error' | 'log' }> = {
  debug:   { color: '\x1b[35m', icon: '🐞', consoleMethod: 'debug' },    // Magenta
  info:    { color: '\x1b[34m', icon: 'ℹ️', consoleMethod: 'info' },     // Blue
  warn:    { color: '\x1b[33m', icon: '⚠️', consoleMethod: 'warn' },     // Yellow
  error:   { color: '\x1b[31m', icon: '❌', consoleMethod: 'error' },    // Red
  success: { color: '\x1b[32m', icon: '✅', consoleMethod: 'log' },      // Green
};

// Map our log levels to Winston levels
const WINSTON_LEVEL_MAP: Record<LogLevel, string> = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  success: 'info', // Winston doesn't have 'success', map to 'info'
};

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;
  private readonly reset = '\x1b[0m';
  private winstonLogger: WinstonLogger;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';

    // Initialize Winston logger
    this.winstonLogger = createLogger({
      level: this.isDevelopment ? 'debug' : 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.errors({ stack: true })
      ),
      defaultMeta: { service: 'orion' },
      transports: [
        // Write all logs to console in development
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          )
        }),
        // Write all logs with level 'error' and below to 'error.log'
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        // Write all logs to 'combined.log'
        new transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        })
      ]
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const { color, icon } = LOG_STYLES[level];
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${color}${JSON.stringify(context, null, 2)}${this.reset}` : '';
    return `${color}${icon} [${level.toUpperCase()}][${timestamp}]${this.reset} ${message}${contextStr}`;
  }

  public log(level: LogLevel, message: string, context?: LogContext) {
    // Only log debug messages in development
    if (level === 'debug' && !this.isDevelopment) {
      return;
    }

    if (this.isDevelopment) {
      // Use stylish console logging in development
      const formattedMessage = this.formatMessage(level, message, context);
      const { consoleMethod } = LOG_STYLES[level];
      console[consoleMethod](formattedMessage);
    } else {
      // Use Winston in production
      const winstonLevel = WINSTON_LEVEL_MAP[level];
      this.winstonLogger.log(winstonLevel, message, {
        ...context,
        level: winstonLevel,
        timestamp: new Date().toISOString()
      });
    }

    // Handle production error logging
    if (!this.isDevelopment && level === 'error') {
      this.handleProductionError(message, context);
    }
  }

  private handleProductionError(message: string, context?: LogContext) {
    // Winston already handles error logging to files
    // Additional error service integration can be added here
    // Example: Sentry.captureException(new Error(message), { extra: context });
  }

  public debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  public info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  public warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  public error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  public success(message: string, context?: LogContext) {
    this.log('success', message, context);
  }

  // Convenience method for API logging
  public api(level: LogLevel, message: string, context?: LogContext) {
    const apiContext = {
      ...context,
      timestamp: new Date().toISOString(),
      environment: this.isDevelopment ? 'development' : 'production',
      type: 'api'
    };
    this.log(level, `[API] ${message}`, apiContext);
  }

  // Convenience method for component logging
  public component(level: LogLevel, componentName: string, message: string, context?: LogContext) {
    const componentContext = {
      ...context,
      component: componentName,
      timestamp: new Date().toISOString(),
      type: 'component'
    };
    this.log(level, `[Component:${componentName}] ${message}`, componentContext);
  }

  // Convenience method for state management logging
  public state(level: LogLevel, storeName: string, action: string, context?: LogContext) {
    const stateContext = {
      ...context,
      store: storeName,
      action,
      timestamp: new Date().toISOString(),
      type: 'state'
    };
    this.log(level, `[State:${storeName}] ${action}`, stateContext);
  }
}

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

let logger: any;

if (isNode) {
  logger = require('../src/lib/logger.node').logger;
} else {
  logger = {
    debug: (msg: string, ctx?: any) => console.debug(`%c🐞 [DEBUG] ${msg}`, 'color:magenta', ctx || ''),
    info: (msg: string, ctx?: any) => console.info(`%cℹ️ [INFO] ${msg}`, 'color:blue', ctx || ''),
    warn: (msg: string, ctx?: any) => console.warn(`%c⚠️ [WARN] ${msg}`, 'color:orange', ctx || ''),
    error: (msg: string, ctx?: any) => {
      if (ctx && typeof ctx === 'object' && Object.keys(ctx).length > 0) {
        console.error(`%c❌ [ERROR] ${msg}`, 'color:red', ctx);
      } else {
        console.warn(`%c❌ [ERROR] ${msg}`, 'color:red', ctx || '');
      }
    },
    success: (msg: string, ctx?: any) => console.log(`%c✅ [SUCCESS] ${msg}`, 'color:green', ctx || ''),
  };
}

export { logger };

/**
 * Enhanced Logger for Orion
 * Combines Winston for production logging with stylish console output for development.
 * usage:
 * connection to other
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

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface LogContext {
  [key: string]: unknown;
}

const LOG_STYLES: Record<
  LogLevel,
  {
    color: string;
    icon: string;

    consoleMethod: 'debug' | 'info' | 'warn' | 'error' | 'log';
  }
> = {
  debug: { color: '\x1b[35m', icon: '🐞', consoleMethod: 'debug' }, // Magenta
  info: { color: '\x1b[34m', icon: 'ℹ️', consoleMethod: 'info' }, // Blue
  warn: { color: '\x1b[33m', icon: '⚠️', consoleMethod: 'warn' }, // Yellow
  error: { color: '\x1b[31m', icon: '❌', consoleMethod: 'error' }, // Red
  success: { color: '\x1b[32m', icon: '✅', consoleMethod: 'log' }, // Green
};

// Map our log levels to Winston levels
const WINSTON_LEVEL_MAP: Record<LogLevel, string> = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  success: 'info', // Winston doesn't have 'success', map to 'info'
};

// Define a type for the Winston logger instance, or null if not initialized
type WinstonLoggerInstance = import('winston').Logger | null;

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;
  private readonly reset = '\x1b[0m';
  private winstonLogger: WinstonLoggerInstance = null; // Initialize as null

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';

    // Initialize Winston logger only on the server-side
    if (typeof window === 'undefined') {
      import('winston')
        .then(({ createLogger, format, transports }) => {
          this.winstonLogger = createLogger({
            level: this.isDevelopment ? 'debug' : 'info',
            format: format.combine(format.timestamp(), format.json(), format.errors({ stack: true })),
            defaultMeta: { service: 'orion' },
            transports: [
              new transports.Console({
                format: format.combine(format.colorize(), format.simple()),
              }),
              // Always add file transports in a server-side non-development environment
              ...(!this.isDevelopment
                ? [
                    new transports.File({
                      filename: 'logs/error.log',
                      level: 'error',
                      maxsize: 5242880, // 5MB
                      maxFiles: 5,
                    }),
                    new transports.File({
                      filename: 'logs/combined.log',
                      maxsize: 5242880, // 5MB
                      maxFiles: 5,
                    }),
                  ]
                : []), // Conditionally add file transports
            ],
          });
        })
        .catch((err) => {
          console.error('Failed to initialize Winston logger on server:', err);
        });
    }
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

    let processedContext = context;
    if (context) {
      processedContext = { ...context }; // Create a shallow copy to avoid modifying original context object
      for (const key in processedContext) {
        if (Object.prototype.hasOwnProperty.call(processedContext, key)) {
          const value = processedContext[key];
          if (value instanceof Error) {
            // Custom serialization for Error objects
            processedContext[key] = {
              name: value.name,
              message: value.message,
              stack: value.stack, // Include stack for errors
              ...(value instanceof Object && 'status' in value ? { status: (value as any).status } : {}), // For APIError
              ...(value instanceof Object && 'data' in value ? { data: (value as any).data } : {}), // For APIError
              ...(value instanceof Object && 'isRetryable' in value ? { isRetryable: (value as any).isRetryable } : {}), // For APIError
            };
          }
        }
      }
    }

    const contextStr = processedContext ? ` ${color}${JSON.stringify(processedContext, null, 2)}${this.reset}` : '';
    return `${color}${icon} [${level.toUpperCase()}][${timestamp}]${this.reset} ${message}${contextStr}`;
  }

  public log(level: LogLevel, message: string, context?: LogContext) {
    // Only log debug messages in development
    if (level === 'debug' && !this.isDevelopment) {
      return;
    }

    if (this.isDevelopment || typeof window !== 'undefined') {
      // Use stylish console logging in development or on the client-side
      const formattedMessage = this.formatMessage(level, message, context);
      const { consoleMethod } = LOG_STYLES[level];
      // Add a debug log to inspect the consoleMethod
      console.debug(`[LOGGER_DEBUG] Attempting to use console method: ${consoleMethod} for level: ${level}`);
      console[consoleMethod](formattedMessage);
    }

    // Use Winston in production on the server-side
    if (!this.isDevelopment && typeof window === 'undefined' && this.winstonLogger) {
      const winstonLevel = WINSTON_LEVEL_MAP[level];
      this.winstonLogger.log(winstonLevel, message, {
        ...context,
        level: winstonLevel,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle production error logging
    if (!this.isDevelopment && level === 'error') {
      this.handleProductionError(message, context);
    }
  }

  private handleProductionError(message: string, context?: LogContext) {
    // This is a placeholder for integrating with a dedicated error reporting service (e.g., Sentry, Bugsnag).
    // For now, it ensures the error message and context are logged directly to the console
    // in production environments as a fallback for immediate visibility.
    console.error(`[PRODUCTION_ERROR_HANDLER] Unhandled error: ${message}`, context);
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
      type: 'api',
    };
    this.log(level, `[API] ${message}`, apiContext);
  }

  // Convenience method for component logging
  public component(level: LogLevel, componentName: string, message: string, context?: LogContext) {
    const componentContext = {
      ...context,
      component: componentName,
      timestamp: new Date().toISOString(),
      type: 'component',
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
      type: 'state',
    };
    this.log(level, `[State:${storeName}] ${action}`, stateContext);
  }
}

const logger = Logger.getInstance();
export default logger;

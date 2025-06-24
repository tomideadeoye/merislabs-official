/**
 * @fileoverview Centralized logging utility for the Orion application.
 * @description This module provides a robust, level-based logging system with rich context support, designed to work consistently across both client-side (browser) and server-side (Node.js/Next.js API routes) environments. It integrates with Winston for server-side production logging and uses console methods for development and client-side, ensuring traceable and debuggable application behavior.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a unified logging interface (`debug`, `info`, `warn`, `error`, `success`, `api`, `component`, `state`).
 *   - To ensure consistent log formatting and context enrichment (e.g., timestamps, component names, API details).
 *   - To differentiate logging behavior based on environment (development vs. production) and execution context (client vs. server).
 *   - To integrate with Winston for advanced server-side logging capabilities (e.g., file transports, log rotation).
 *   - To facilitate rapid debugging and monitoring by providing traceable log messages with unique IDs (e.g., errorId in `handleApiError`).
 *   - To handle and serialize complex data types within log contexts, specifically `Error` objects and custom error types like `APIError`.
 *
 * FILEPATH: `app/lib/logger.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `winston` (npm package): Used for robust server-side logging, including file transports and log rotation.
 *   - `@/lib/orion_config.ts`: May provide configuration parameters related to logging levels or destinations.
 *   - `app/lib/utils/errorHandler.ts`: The `handleApiError` utility heavily relies on this logger for structured error reporting.
 *   - `app/lib/apiClient.ts`: Defines `APIError` and `NetworkError` which are processed and serialized by this logger.
 *   - All API Routes (`app/api/orion/.../route.ts`): Directly import and use this logger for server-side operation tracing.
 *   - All Client-Side Components (`app/components/orion/...`): Directly import and use this logger for client-side event tracking and debugging.
 *   - Other Services/Utilities (`app/lib/...`): Integrate with this logger for consistent internal logging.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Winston is only initialized on the server-side to avoid client-side bundling issues and unnecessary overhead.
 *   - Log context objects are shallow-copied before modification to prevent side effects.
 *   - Custom serialization for `Error` objects and `APIError` instances ensures all relevant details (message, stack, status, data) are captured.
 *   - The console methods are dynamically accessed with a defensive check to ensure they are valid functions.
 *
 * NOTES:
 *   - This logging system is foundational for Orion's observability, enabling developers to understand application flow, debug issues, and monitor performance.
 *   - The distinction between development/client-side and production/server-side logging is critical for both developer experience and production robustness.
 *   - Proper serialization of error objects within log contexts is essential for effective error analysis.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Asynchronous Logging**: For very high-volume logging scenarios, consider implementing asynchronous logging to prevent blocking the main thread.
 *   - **External Log Aggregation**: Integrate with external log aggregation services (e.g., Datadog, ELK Stack, Splunk) for centralized log management, querying, and alerting in production.
 *   - **Log Level Configuration**: Allow log levels to be configured dynamically (e.g., via environment variables or a runtime setting) without requiring a redeploy.
 *   - **Performance Optimization**: Profile logging performance in production to identify and optimize any bottlenecks, especially for high-frequency logs.
 *   - **Sensitive Data Redaction**: Implement automatic redaction of sensitive information (e.g., API keys, PII) from log contexts before they are written to prevent data leaks.
 *   - **Structured Logging Schema**: Enforce a more rigid structured logging schema (e.g., JSON Schema) for better compatibility with log parsers and analytics tools.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - Ensure all custom error types throughout the codebase are consistently handled and serialized by this logger's `formatMessage` method.
 *   - Promote the use of the `api`, `component`, and `state` convenience methods to standardize log messages across different application layers.
 */

import { APIError } from './apiClient'; // Import APIError

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

export interface LogContext {
  [key: string]: unknown;
  disableConsole?: boolean; // New flag to disable console output for this log entry
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

  private readonly reset = '\x1b[0m';
  private winstonLogger: WinstonLoggerInstance = null; // Initialize as null

  private constructor() {
    // Initialize Winston logger only on the server-side
    if (typeof window === 'undefined') {
      import('winston')
        .then(({ createLogger, format, transports }) => {
          this.winstonLogger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json(), format.errors({ stack: true })),
            defaultMeta: { service: 'orion' },
            transports: [
              new transports.Console({
                format: format.combine(format.colorize(), format.simple()),
              }),
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
              ...(value instanceof APIError
                ? { status: value.status, data: value.data, isRetryable: value.isRetryable }
                : {}),
            };
          } else if (
            typeof value === 'object' &&
            value !== null &&
            'status' in value &&
            'data' in value &&
            'isRetryable' in value
          ) {
            // Fallback for objects that look like APIError but are not instances
            processedContext[key] = {
              name: 'ApiErrorObject',
              message: (value as { message?: string }).message || 'API Error Object',
              status: (value as { status?: number }).status,
              data: (value as { data?: unknown }).data,
              isRetryable: (value as { isRetryable?: boolean }).isRetryable,
            };
          }
        }
      }
    }

    const contextStr = processedContext ? ` ${color}${JSON.stringify(processedContext, null, 2)}${this.reset}` : '';
    return `${color}${icon} [${level.toUpperCase()}][${timestamp}]${this.reset} ${message}${contextStr}`;
  }

  public log(level: LogLevel, message: string, context?: LogContext) {
    // Always log to console
    const formattedMessage = this.formatMessage(level, message, context);
    const { consoleMethod } = LOG_STYLES[level];
    // Add a debug log to inspect the consoleMethod
    console.debug(`[LOGGER_DEBUG] Attempting to use console method: ${consoleMethod} for level: ${level}`);
    const logFunction = console[consoleMethod] as
      | ((message?: unknown, ...optionalParams: unknown[]) => void)
      | undefined;
    if (typeof logFunction === 'function') {
      logFunction(formattedMessage);
    } else {
      console.log(`[LOGGER_FALLBACK][${level.toUpperCase()}] ${formattedMessage}`);
    }
    // Always use Winston if available (server-side)
    if (typeof window === 'undefined' && this.winstonLogger) {
      const winstonLevel = WINSTON_LEVEL_MAP[level];
      this.winstonLogger.log(winstonLevel, message, {
        ...context,
        level: winstonLevel,
        timestamp: new Date().toISOString(),
      });
    }
    // Always handle production error logging for errors
    if (level === 'error') {
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
      environment: 'production',
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

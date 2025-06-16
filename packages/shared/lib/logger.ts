// GOAL OF FILE|FEATURES|FUNCTIONS:
//   - Centralized, robust, and extensible logging utility for the entire Orion simple nextjs project.
//   - Provides clear, context-rich, and level-based logging for debugging, monitoring, and traceability.
//   - Adheres to project logging standards: comprehensive, includes operation, user/session context, parameters, validation, and results.
// FILEPATH:
//   packages/shared/lib/logger.ts
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Imported by all applications and packages within the simple nextjs project that require logging.
//   - Designed to be a single source of truth for logging, preventing scattered console.logs or inconsistent logging practices.
// ASSUMPTIONS & CLEAR COMMENTS
//   - Assumes a consistent environment where console methods are available.
//   - NOTE: For production, this logger should integrate with a proper logging service (e.g., Sentry, DataDog, Winston).
// NOTES:
//   - Consider adding a mechanism for toggling log levels based on environment variables (e.g., `process.env.NODE_ENV`).
//   - Could be extended to support different log transports (file, network, etc.).
//   - For browser environments, ensure sensitive data is not logged.

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogContext {
  operation?: string;
  userId?: string;
  sessionId?: string;
  params?: Record<string, unknown>;
  validation?: Record<string, unknown>;
  results?: Record<string, unknown>;
  [key: string]: unknown; // Allow for arbitrary additional context
}

class OrionLogger {
  private static instance: OrionLogger;
  private currentLogLevel: LogLevel = LogLevel.INFO; // Default log level

  private constructor() {
    // Initialize log level from environment variable if available
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_LOG_LEVEL) {
      const envLevel = process.env.NEXT_PUBLIC_LOG_LEVEL.toUpperCase();
      if (Object.values(LogLevel).includes(envLevel as LogLevel)) {
        this.currentLogLevel = envLevel as LogLevel;
      }
    }
  }

  public static getInstance(): OrionLogger {
    if (!OrionLogger.instance) {
      OrionLogger.instance = new OrionLogger();
    }
    return OrionLogger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.currentLogLevel);
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const levelTag = `[${level.toUpperCase()}]`.padEnd(7);
    const contextString = context ? ` ${JSON.stringify(context)}` : '';
    return `${timestamp} ${levelTag} ${message}${contextString}`;
  }

  public debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  public info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message, context));
    }
  }

  public warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context));
    }
  }

  public error(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(LogLevel.ERROR, message, context));
    }
  }

  // Method to dynamically set log level (useful for testing or advanced scenarios)
  public setLogLevel(level: LogLevel): void {
    if (Object.values(LogLevel).includes(level)) {
      this.currentLogLevel = level;
      this.info(`[Logger] Log level updated to: ${level}`);
    } else {
      this.warn(`[Logger] Attempted to set invalid log level: ${level}`);
    }
  }
}

const sharedLogger = OrionLogger.getInstance();
export default sharedLogger;

// Re-export LogLevel for external use

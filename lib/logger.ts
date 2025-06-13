import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface LogContext {
  [key: string]: any;
}

const LOG_STYLES: Record<LogLevel, { color: string; icon: string; consoleMethod: 'debug' | 'info' | 'warn' | 'error' | 'log' }> = {
  debug:   { color: '\x1b[35m', icon: '🐞', consoleMethod: 'debug' },
  info:    { color: '\x1b[34m', icon: 'ℹ️', consoleMethod: 'info' },
  warn:    { color: '\x1b[33m', icon: '⚠️', consoleMethod: 'warn' },
  error:   { color: '\x1b[31m', icon: '❌', consoleMethod: 'error' },
  success: { color: '\x1b[32m', icon: '✅', consoleMethod: 'log' },
};

const WINSTON_LEVEL_MAP: Record<LogLevel, string> = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  success: 'info',
};

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;
  private readonly reset = '\x1b[0m';
  private winstonLogger: WinstonLogger;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';

    this.winstonLogger = createLogger({
      level: this.isDevelopment ? 'debug' : 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.errors({ stack: true })
      ),
      defaultMeta: { service: 'orion' },
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          )
        }),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880,
          maxFiles: 5,
        }),
        new transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880,
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
    if (level === 'debug' && !this.isDevelopment) return;

    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(level, message, context);
      const { consoleMethod } = LOG_STYLES[level];
      console[consoleMethod](formattedMessage);
    } else {
      const winstonLevel = WINSTON_LEVEL_MAP[level];
      this.winstonLogger.log(winstonLevel, message, {
        ...context,
        level: winstonLevel,
        timestamp: new Date().toISOString()
      });
    }

    if (!this.isDevelopment && level === 'error') {
      this.handleProductionError(message, context);
    }
  }

  private handleProductionError(message: string, context?: LogContext) {
    // Error service integration placeholder
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

  public api(level: LogLevel, message: string, context?: LogContext) {
    const apiContext = {
      ...context,
      timestamp: new Date().toISOString(),
      environment: this.isDevelopment ? 'development' : 'production',
      type: 'api'
    };
    this.log(level, `[API] ${message}`, apiContext);
  }

  public component(level: LogLevel, componentName: string, message: string, context?: LogContext) {
    const componentContext = {
      ...context,
      component: componentName,
      timestamp: new Date().toISOString(),
      type: 'component'
    };
    this.log(level, `[Component:${componentName}] ${message}`, componentContext);
  }

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

export const logger = Logger.getInstance();

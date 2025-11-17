import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { envs } from 'src/config/env';
import { Environments } from 'src/domain/enums/envieroments.enum';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logLevels: LogLevel[];
  private readonly context: string;

  constructor(context?: string) {
    this.context = context || 'Application';
    this.logLevels = this.getLogLevels();
  }

  private getLogLevels(): LogLevel[] {
    const env = envs.NODE_ENV as Environments;

    switch (env) {
      case Environments.PRODUCTION:
        return ['error', 'warn', 'log'];
      case Environments.STAGING:
        return ['error', 'warn'];
      case Environments.DEVELOPMENT:
      default:
        return ['error', 'warn', 'log', 'debug', 'verbose'];
    }
  }

  private isLevelEnabled(level: LogLevel): boolean {
    return this.logLevels.includes(level);
  }

  private formatMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context;
    return `[${timestamp}] [${level.toUpperCase()}] [${ctx}] ${message}`;
  }

  log(message: string, context?: string): void {
    if (this.isLevelEnabled('log')) {
      console.log(this.formatMessage('log', message, context));
    }
  }

  error(message: string, trace?: string, context?: string): void {
    if (this.isLevelEnabled('error')) {
      console.error(this.formatMessage('error', message, context));
      if (trace) {
        console.error('Stack Trace:', trace);
      }
    }
  }

  warn(message: string, context?: string): void {
    if (this.isLevelEnabled('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  /**
   * Log de debug (solo en desarrollo)
   */
  debug(message: string, context?: string): void {
    if (this.isLevelEnabled('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

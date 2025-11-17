import { HttpException } from '@nestjs/common';
import { DomainErrorDefinition } from '../enums/domain.error.enum';

/**
 * Clase base para errores de dominio
 */
export class DomainError extends HttpException {
  public readonly code: string;
  public readonly timestamp: string;
  public readonly details?: unknown;

  constructor(
    errorDefinition: DomainErrorDefinition,
    details?: unknown,
    customMessage?: string,
  ) {
    const message = customMessage || errorDefinition.message;

    super(
      {
        code: errorDefinition.code,
        message,
        statusCode: errorDefinition.statusCode,
        details,
        timestamp: new Date().toISOString(),
      },
      errorDefinition.statusCode,
    );

    this.code = errorDefinition.code;
    this.timestamp = new Date().toISOString();
    this.details = details;
  }
}

// src/web-api/dtos/common/errors.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { DomainErrorBR } from '../../../domain/enums/domain.error.enum';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error code',
    example: DomainErrorBR.PRODUCT_NOT_FOUND.code,
  })
  code: string;

  @ApiProperty({
    description: 'Error message',
    example: DomainErrorBR.PRODUCT_NOT_FOUND.message,
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: DomainErrorBR.PRODUCT_NOT_FOUND.statusCode,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2024-11-17T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Additional error details',
    required: false,
  })
  details?: unknown;
}

export class UnauthorizedErrorDto {
  @ApiProperty({
    description: 'Error code',
    example: DomainErrorBR.INVALID_TOKEN.code,
  })
  code: string;

  @ApiProperty({
    description: 'Error message',
    example: DomainErrorBR.INVALID_TOKEN.message,
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2024-11-17T10:30:00.000Z',
  })
  timestamp: string;
}

export class NotFoundErrorDto {
  @ApiProperty({
    description: 'Error code',
    example: DomainErrorBR.PRODUCT_NOT_FOUND.code,
  })
  code: string;

  @ApiProperty({
    description: 'Error message',
    example: DomainErrorBR.PRODUCT_NOT_FOUND.message,
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2024-11-17T10:30:00.000Z',
  })
  timestamp: string;
}

export class BadRequestErrorDto {
  @ApiProperty({
    description: 'Error code',
    example: DomainErrorBR.VALIDATION_ERROR.code,
  })
  code: string;

  @ApiProperty({
    description: 'Error message',
    example: DomainErrorBR.VALIDATION_ERROR.message,
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2024-11-17T10:30:00.000Z',
  })
  timestamp: string;
}

export class InternalServerErrorDto {
  @ApiProperty({
    description: 'Error code',
    example: DomainErrorBR.INTERNAL_ERROR.code,
  })
  code: string;

  @ApiProperty({
    description: 'Error message',
    example: DomainErrorBR.INTERNAL_ERROR.message,
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 500,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2024-11-17T10:30:00.000Z',
  })
  timestamp: string;
}

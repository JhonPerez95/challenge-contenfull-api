import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class DateRangeQueryDto {
  @ApiProperty({
    description: 'Start date in ISO 8601 format',
    example: '2024-11-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date in ISO 8601 format',
    example: '2024-11-17T23:59:59.999Z',
  })
  @IsDateString()
  endDate: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class DateRangeResponseDto {
  @ApiProperty({
    description: 'Start date of the range',
    example: '2024-11-01T00:00:00.000Z',
  })
  startDate: string;

  @ApiProperty({
    description: 'End date of the range',
    example: '2024-11-17T23:59:59.999Z',
  })
  endDate: string;

  @ApiProperty({
    description: 'Total products created in the date range',
    example: 15,
  })
  totalProducts: number;

  @ApiProperty({
    description: 'Active products in the date range',
    example: 12,
  })
  activeProducts: number;

  @ApiProperty({
    description: 'Deleted products in the date range',
    example: 3,
  })
  deletedProducts: number;

  static fromDomain(report: {
    startDate: Date;
    endDate: Date;
    totalProducts: number;
    activeProducts: number;
    deletedProducts: number;
  }): DateRangeResponseDto {
    const dto = new DateRangeResponseDto();
    dto.startDate = report.startDate.toISOString();
    dto.endDate = report.endDate.toISOString();
    dto.totalProducts = report.totalProducts;
    dto.activeProducts = report.activeProducts;
    dto.deletedProducts = report.deletedProducts;
    return dto;
  }
}

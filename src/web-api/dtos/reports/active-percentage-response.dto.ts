import { ApiProperty } from '@nestjs/swagger';

export class ActivePercentageResponseDto {
  @ApiProperty({
    description: 'Total number of active products (not deleted)',
    example: 17,
  })
  totalActiveProducts: number;

  @ApiProperty({
    description: 'Number of active products with price (price > 0)',
    example: 15,
  })
  withPrice: number;

  @ApiProperty({
    description: 'Number of active products without price (price = 0 or null)',
    example: 2,
  })
  withoutPrice: number;

  @ApiProperty({
    description: 'Percentage of active products with price',
    example: 88.24,
  })
  withPricePercentage: number;

  @ApiProperty({
    description: 'Percentage of active products without price',
    example: 11.76,
  })
  withoutPricePercentage: number;

  static fromDomain(report: {
    totalActiveProducts: number;
    withPrice: number;
    withoutPrice: number;
    withPricePercentage: number;
    withoutPricePercentage: number;
  }): ActivePercentageResponseDto {
    const dto = new ActivePercentageResponseDto();
    dto.totalActiveProducts = report.totalActiveProducts;
    dto.withPrice = report.withPrice;
    dto.withoutPrice = report.withoutPrice;
    dto.withPricePercentage = report.withPricePercentage;
    dto.withoutPricePercentage = report.withoutPricePercentage;
    return dto;
  }
}

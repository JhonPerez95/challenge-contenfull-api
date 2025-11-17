import { ApiProperty } from '@nestjs/swagger';

export class DeletedPercentageResponseDto {
  @ApiProperty({
    description: 'Total number of products (active + deleted)',
    example: 20,
  })
  totalProducts: number;

  @ApiProperty({
    description: 'Number of deleted products',
    example: 3,
  })
  deletedProducts: number;

  @ApiProperty({
    description: 'Percentage of deleted products',
    example: 15.0,
  })
  deletedPercentage: number;

  static fromDomain(report: {
    totalProducts: number;
    deletedProducts: number;
    deletedPercentage: number;
  }): DeletedPercentageResponseDto {
    const dto = new DeletedPercentageResponseDto();
    dto.totalProducts = report.totalProducts;
    dto.deletedProducts = report.deletedProducts;
    dto.deletedPercentage = report.deletedPercentage;
    return dto;
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class CategoryReportDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
  })
  category: string;

  @ApiProperty({
    description: 'Number of products in this category',
    example: 15,
  })
  count: number;

  @ApiProperty({
    description: 'Percentage of products in this category',
    example: 75.0,
  })
  percentage: number;
}

export class ProductsByCategoryResponseDto {
  @ApiProperty({
    description: 'Total number of active products',
    example: 20,
  })
  totalProducts: number;

  @ApiProperty({
    description: 'Total number of unique categories',
    example: 3,
  })
  totalCategories: number;

  @ApiProperty({
    description: 'Products grouped by category',
    type: [CategoryReportDto],
  })
  categories: CategoryReportDto[];

  static fromDomain(report: {
    totalProducts: number;
    totalCategories: number;
    categories: Array<{
      category: string;
      count: number;
      percentage: number;
    }>;
  }): ProductsByCategoryResponseDto {
    const dto = new ProductsByCategoryResponseDto();
    dto.totalProducts = report.totalProducts;
    dto.totalCategories = report.totalCategories;
    dto.categories = report.categories;
    return dto;
  }
}

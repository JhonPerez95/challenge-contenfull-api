import { Injectable, Inject } from '@nestjs/common';
import { AppLoggerService } from '../../../infrastructure/logging/logger.service';

import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product.repository';
import {
  CategoryReport,
  IGetProductsByCategoryUseCase,
  ProductsByCategoryReport,
} from '../../../domain/use-cases/get-products-by-category.interface';

@Injectable()
export class GetProductsByCategoryService
  implements IGetProductsByCategoryUseCase
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(GetProductsByCategoryService.name);
  }

  async execute(): Promise<ProductsByCategoryReport> {
    const categoryData = await this.productRepository.countByCategory();
    const totalProducts = await this.productRepository.countActive();

    const categories: CategoryReport[] = categoryData.map((item) => ({
      category: item.category,
      count: item.count,
      percentage:
        totalProducts > 0
          ? parseFloat(((item.count / totalProducts) * 100).toFixed(2))
          : 0,
    }));

    return {
      totalProducts,
      totalCategories: categories.length,
      categories,
    };
  }
}

import { Injectable, Inject } from '@nestjs/common';

import {
  IGetProductsByDateRangeUseCase,
  DateRangeReport,
} from '../../../domain/use-cases/get-products-by-date-range.interface';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
  DateRangeFilter,
} from '../../../domain/repositories/product.repository';

import { AppLoggerService } from '../../../infrastructure/logging/logger.service';

@Injectable()
export class GetProductsByDateRangeService
  implements IGetProductsByDateRangeUseCase
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(GetProductsByDateRangeService.name);
  }

  async execute(dateRange: DateRangeFilter): Promise<DateRangeReport> {
    const totalProducts =
      await this.productRepository.countByDateRange(dateRange);
    const activeProducts =
      await this.productRepository.countActiveByDateRange(dateRange);
    const deletedProducts =
      await this.productRepository.countDeletedByDateRange(dateRange);

    return {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      totalProducts,
      activeProducts,
      deletedProducts,
    };
  }
}

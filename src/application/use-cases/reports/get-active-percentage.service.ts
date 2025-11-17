import { Injectable, Inject } from '@nestjs/common';

import { AppLoggerService } from '../../../infrastructure/logging/logger.service';

import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product.repository';
import {
  ActivePercentageReport,
  IGetActivePercentageUseCase,
} from '../../../domain/use-cases/get-active-percentage.interface';

@Injectable()
export class GetActivePercentageService implements IGetActivePercentageUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(GetActivePercentageService.name);
  }

  async execute(): Promise<ActivePercentageReport> {
    const totalActiveProducts = await this.productRepository.countActive();
    const withPrice = await this.productRepository.countWithPrice();
    const withoutPrice = await this.productRepository.countWithoutPrice();

    const withPricePercentage =
      totalActiveProducts > 0 ? (withPrice / totalActiveProducts) * 100 : 0;

    const withoutPricePercentage =
      totalActiveProducts > 0 ? (withoutPrice / totalActiveProducts) * 100 : 0;

    return {
      totalActiveProducts,
      withPrice,
      withoutPrice,
      withPricePercentage: parseFloat(withPricePercentage.toFixed(2)),
      withoutPricePercentage: parseFloat(withoutPricePercentage.toFixed(2)),
    };
  }
}

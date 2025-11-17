import { Injectable, Inject } from '@nestjs/common';

import { AppLoggerService } from '../../../infrastructure/logging/logger.service';

import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product.repository';
import {
  DeletedPercentageReport,
  IGetDeletedPercentageUseCase,
} from '../../../domain/use-cases/get-deleted-percentage.interface';

@Injectable()
export class GetDeletedPercentageService
  implements IGetDeletedPercentageUseCase
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(GetDeletedPercentageService.name);
  }

  async execute(): Promise<DeletedPercentageReport> {
    const totalProducts = await this.productRepository.getTotalCount();
    const deletedProducts = await this.productRepository.countDeleted();

    const deletedPercentage =
      totalProducts > 0 ? (deletedProducts / totalProducts) * 100 : 0;

    this.logger.log(
      `Deleted percentage calculated: ${deletedPercentage.toFixed(2)}%`,
    );

    return {
      totalProducts,
      deletedProducts,
      deletedPercentage: parseFloat(deletedPercentage.toFixed(2)),
    };
  }
}

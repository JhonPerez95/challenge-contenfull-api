import { Injectable, Inject } from '@nestjs/common';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
  ProductFilters,
  PaginatedResult,
} from '../../../domain/repositories/product.repository';
import { Product } from '../../../domain/entities/product.entity';
import { IGetProductsUseCase } from '../../../domain/use-cases/get-products.interface';
import { DomainErrorBR } from '../../../domain/enums/domain.error.enum';
import { DomainError } from '../../../domain/exceptions/domain.error';
import { AppLoggerService } from '../../../infrastructure/logging/logger.service';

@Injectable()
export class GetProductsService implements IGetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(GetProductsService.name);
  }

  async execute(filters: ProductFilters): Promise<PaginatedResult<Product>> {
    this.logger.log(
      `Getting products with filters: ${JSON.stringify(filters)}`,
    );

    try {
      const result = await this.productRepository.findByFilters(filters);

      this.logger.log(
        `Found ${result.data.length} products (total: ${result.total})`,
      );

      return result;
    } catch (error: any) {
      this.logger.error(
        'Failed to get products',
        error?.stack || JSON.stringify(error),
      );
      throw new DomainError(DomainErrorBR.INTERNAL_ERROR);
    }
  }
}

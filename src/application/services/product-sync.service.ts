import { Injectable, Inject } from '@nestjs/common';

import { AppLoggerService } from '../../infrastructure/logging/logger.service';

import { IProductSyncService } from '../../domain/services/product-sync-service.interface';
import {
  CONTENTFUL_SERVICE,
  IContentfulService,
} from '../../domain/services/contentful.service.interface';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import { DomainError } from '../../domain/exceptions/domain.error';
import { DomainErrorBR } from '../../domain/enums/domain.error.enum';

import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductSyncService implements IProductSyncService {
  private lastSyncDate: Date;

  constructor(
    @Inject(CONTENTFUL_SERVICE)
    private readonly contentfulService: IContentfulService,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(ProductSyncService.name);
    this.lastSyncDate = new Date();
  }

  async syncProducts(): Promise<void> {
    try {
      const updatedProducts =
        await this.contentfulService.getProductsUpdatedSince(this.lastSyncDate);

      for (const contentfulProduct of updatedProducts) {
        const product = ProductMapper.fromContentful(contentfulProduct);
        await this.productRepository.upsert(product);
      }

      this.lastSyncDate = new Date();
    } catch (error: any) {
      this.logger.error(
        'Failed to synchronize products',
        error?.stack || JSON.stringify(error),
      );
      throw new DomainError(DomainErrorBR.PRODUCT_SYNC_ERROR);
    }
  }

  async initialSync(): Promise<void> {
    try {
      const allProducts = await this.contentfulService.getAllProducts();

      for (const contentfulProduct of allProducts) {
        const product = ProductMapper.fromContentful(contentfulProduct);
        await this.productRepository.upsert(product);
      }

      this.lastSyncDate = new Date();
    } catch (error: any) {
      this.logger.error(
        'Failed to perform initial synchronization',
        error?.stack || JSON.stringify(error),
      );
      throw new DomainError(DomainErrorBR.PRODUCT_SYNC_ERROR);
    }
  }
}

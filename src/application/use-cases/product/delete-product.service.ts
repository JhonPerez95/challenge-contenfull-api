import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/repositories/product.repository';
import { IDeleteProductUseCase } from '../../../domain/use-cases/delete-product.interface';
import { AppLoggerService } from '../../../infrastructure/logging/logger.service';
import { DomainError } from '../../../domain/exceptions/domain.error';
import { DomainErrorBR } from 'src/domain/enums/domain.error.enum';

@Injectable()
export class DeleteProductService implements IDeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(DeleteProductService.name);
  }

  async execute(id: string): Promise<void> {
    this.logger.log(`Attempting to delete product with id: ${id}`);

    try {
      const product = await this.productRepository.findById(id);

      if (!product) {
        this.logger.warn(`Product not found with id: ${id}`);
        throw new NotFoundException(DomainErrorBR.PRODUCT_NOT_FOUND);
      }

      if (product.deletedAt) {
        this.logger.warn(`Product already deleted with id: ${id}`);
        throw new DomainError(
          DomainErrorBR.PRODUCT_ALREADY_DELETED,
          `Product with id ${id} is already deleted`,
        );
      }

      await this.productRepository.softDelete(id);

      this.logger.log(`Product successfully deleted with id: ${id}`);
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof DomainError) {
        throw error;
      }

      this.logger.error(
        `Failed to delete product with id: ${id}`,
        error?.stack || JSON.stringify(error),
      );
      throw new DomainError(DomainErrorBR.INTERNAL_ERROR);
    }
  }
}

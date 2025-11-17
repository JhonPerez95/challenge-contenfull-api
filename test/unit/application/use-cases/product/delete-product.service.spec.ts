import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteProductService } from '../../../../../src/application/use-cases/product/delete-product.service';
import { PRODUCT_REPOSITORY } from '../../../../../src/domain/repositories/product.repository';
import { AppLoggerService } from '../../../../../src/infrastructure/logging/logger.service';
import { DomainError } from '../../../../../src/domain/exceptions/domain.error';

import {
  createMockLogger,
  createMockProduct,
  createMockDeletedProduct,
  createMockProductRepository,
} from '../../../../mocks';

describe('DeleteProductService', () => {
  let service: DeleteProductService;
  let mockProductRepository: ReturnType<typeof createMockProductRepository>;
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(async () => {
    mockProductRepository = createMockProductRepository();
    mockLogger = createMockLogger();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
        {
          provide: AppLoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<DeleteProductService>(DeleteProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should delete product successfully', async () => {
      const productId = '123';
      const mockProduct = createMockProduct({ id: productId });

      const spyFindById = jest
        .spyOn(mockProductRepository, 'findById')
        .mockResolvedValue(mockProduct);

      const spySoftDelete = jest
        .spyOn(mockProductRepository, 'softDelete')
        .mockResolvedValue(undefined);

      await service.execute(productId);

      expect(spyFindById).toHaveBeenCalledWith(productId);
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spySoftDelete).toHaveBeenCalledWith(productId);
      expect(spySoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      const productId = 'non-existent-id';

      const spyFindById = jest
        .spyOn(mockProductRepository, 'findById')
        .mockResolvedValue(null);

      await expect(service.execute(productId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.execute(productId)).rejects.toThrow(
        'Product not found',
      );

      expect(spyFindById).toHaveBeenCalledWith(productId);
    });

    it('should throw DomainError when product is already deleted', async () => {
      const productId = '123';
      const deletedProduct = createMockDeletedProduct();

      const spyFindById = jest
        .spyOn(mockProductRepository, 'findById')
        .mockResolvedValue(deletedProduct);

      await expect(service.execute(productId)).rejects.toThrow(DomainError);
      await expect(service.execute(productId)).rejects.toThrow(
        'Product is already deleted',
      );

      expect(spyFindById).toHaveBeenCalledWith(productId);
    });

    it('should log product deletion attempt', async () => {
      const productId = '123';
      const mockProduct = createMockProduct({ id: productId });

      jest
        .spyOn(mockProductRepository, 'findById')
        .mockResolvedValue(mockProduct);

      jest
        .spyOn(mockProductRepository, 'softDelete')
        .mockResolvedValue(undefined);

      const logSpy = jest.spyOn(mockLogger, 'log');

      await service.execute(productId);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Attempting to delete product with id: ${productId}`,
        ),
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Product successfully deleted with id: ${productId}`,
        ),
      );
    });

    it('should log warning when product not found', async () => {
      const productId = 'non-existent-id';

      jest.spyOn(mockProductRepository, 'findById').mockResolvedValue(null);

      const warnSpy = jest.spyOn(mockLogger, 'warn');

      await expect(service.execute(productId)).rejects.toThrow(
        NotFoundException,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Product not found with id: ${productId}`),
      );
    });

    it('should log warning when product already deleted', async () => {
      const productId = '123';
      const deletedProduct = createMockDeletedProduct();

      jest
        .spyOn(mockProductRepository, 'findById')
        .mockResolvedValue(deletedProduct);

      const warnSpy = jest.spyOn(mockLogger, 'warn');

      await expect(service.execute(productId)).rejects.toThrow(DomainError);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Product already deleted with id: ${productId}`,
        ),
      );
    });

    it('should throw DomainError when repository fails', async () => {
      const productId = '123';
      const mockProduct = createMockProduct({ id: productId });

      jest
        .spyOn(mockProductRepository, 'findById')
        .mockResolvedValue(mockProduct);

      jest
        .spyOn(mockProductRepository, 'softDelete')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.execute(productId)).rejects.toThrow(DomainError);
      await expect(service.execute(productId)).rejects.toThrow(
        'Internal server error',
      );
    });

    it('should log error when deletion fails', async () => {
      const productId = '123';
      const mockProduct = createMockProduct({ id: productId });

      jest
        .spyOn(mockProductRepository, 'findById')
        .mockResolvedValue(mockProduct);

      jest
        .spyOn(mockProductRepository, 'softDelete')
        .mockRejectedValueOnce(new Error('Database error'));

      const errorSpy = jest.spyOn(mockLogger, 'error');

      await expect(service.execute(productId)).rejects.toThrow(DomainError);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Failed to delete product with id: ${productId}`,
        ),
        expect.any(String),
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsService } from '../../../../../src/application/use-cases/product/get-products.service';
import { PRODUCT_REPOSITORY } from '../../../../../src/domain/repositories/product.repository';
import { AppLoggerService } from '../../../../../src/infrastructure/logging/logger.service';

import {
  createMockLogger,
  createMockProduct,
  createMockProductRepository,
} from '../../../../mocks';

describe('GetProductsService', () => {
  let service: GetProductsService;
  let mockProductRepository: ReturnType<typeof createMockProductRepository>;
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(async () => {
    mockProductRepository = createMockProductRepository();
    mockLogger = createMockLogger();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsService,
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

    service = module.get<GetProductsService>(GetProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should return paginated products successfully', async () => {
      const filters = {
        page: 1,
        limit: 10,
      };

      const mockProducts = [
        createMockProduct(),
        createMockProduct({ id: '456', sku: 'SKU002', name: 'Product 2' }),
      ];

      const mockPaginatedResult = {
        data: mockProducts,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      const spyFindByFilters = jest
        .spyOn(mockProductRepository, 'findByFilters')
        .mockResolvedValue(mockPaginatedResult);

      const result = await service.execute(filters);

      expect(spyFindByFilters).toHaveBeenCalledWith(filters);
      expect(spyFindByFilters).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaginatedResult);
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should return products with name filter', async () => {
      const filters = {
        name: 'Product 1',
        page: 1,
        limit: 10,
      };

      const mockProducts = [createMockProduct()];

      const mockPaginatedResult = {
        data: mockProducts,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      const spyFindByFilters = jest
        .spyOn(mockProductRepository, 'findByFilters')
        .mockResolvedValue(mockPaginatedResult);

      const result = await service.execute(filters);

      expect(spyFindByFilters).toHaveBeenCalledWith(filters);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Product 1');
    });

    it('should return products with category filter', async () => {
      const filters = {
        category: 'Electronics',
        page: 1,
        limit: 10,
      };

      const mockProducts = [createMockProduct({ category: 'Electronics' })];

      const mockPaginatedResult = {
        data: mockProducts,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      const spyFindByFilters = jest
        .spyOn(mockProductRepository, 'findByFilters')
        .mockResolvedValue(mockPaginatedResult);

      const result = await service.execute(filters);

      expect(spyFindByFilters).toHaveBeenCalledWith(filters);
      expect(result.data[0].category).toBe('Electronics');
    });

    it('should return products with price range filter', async () => {
      const filters = {
        minPrice: 50,
        maxPrice: 150,
        page: 1,
        limit: 10,
      };

      const mockProducts = [createMockProduct({ price: 100 })];

      const mockPaginatedResult = {
        data: mockProducts,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      const spyFindByFilters = jest
        .spyOn(mockProductRepository, 'findByFilters')
        .mockResolvedValue(mockPaginatedResult);

      const result = await service.execute(filters);

      expect(spyFindByFilters).toHaveBeenCalledWith(filters);
      expect(result.data[0].price).toBeGreaterThanOrEqual(filters.minPrice);
      expect(result.data[0].price).toBeLessThanOrEqual(filters.maxPrice);
    });

    it('should return empty array when no products match filters', async () => {
      const filters = {
        name: 'NonExistent',
        page: 1,
        limit: 10,
      };

      const mockPaginatedResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      jest
        .spyOn(mockProductRepository, 'findByFilters')
        .mockResolvedValue(mockPaginatedResult);

      const result = await service.execute(filters);

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle pagination correctly', async () => {
      const filters = {
        page: 2,
        limit: 5,
      };

      const mockProducts = [
        createMockProduct({ id: '6', sku: 'SKU006' }),
        createMockProduct({ id: '7', sku: 'SKU007' }),
      ];

      const mockPaginatedResult = {
        data: mockProducts,
        total: 12,
        page: 2,
        limit: 5,
        totalPages: 3,
      };

      jest
        .spyOn(mockProductRepository, 'findByFilters')
        .mockResolvedValue(mockPaginatedResult);

      const result = await service.execute(filters);

      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(result.totalPages).toBe(3);
    });

    it('should throw error when repository fails', async () => {
      const filters = {
        page: 1,
        limit: 10,
      };

      jest
        .spyOn(mockProductRepository, 'findByFilters')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(service.execute(filters)).rejects.toThrow(
        'Internal server error',
      );
    });

    it('should log getting products', async () => {
      const filters = {
        page: 1,
        limit: 10,
      };

      const mockPaginatedResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      jest
        .spyOn(mockProductRepository, 'findByFilters')
        .mockResolvedValue(mockPaginatedResult);

      const logSpy = jest.spyOn(mockLogger, 'log');

      await service.execute(filters);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Getting products with filters'),
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Found 0 products'),
      );
    });
  });
});

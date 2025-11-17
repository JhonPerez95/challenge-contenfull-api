import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsByCategoryService } from '../../../../../src/application/use-cases/reports/get-products-by-category.service';
import { PRODUCT_REPOSITORY } from '../../../../../src/domain/repositories/product.repository';
import { AppLoggerService } from '../../../../../src/infrastructure/logging/logger.service';

import {
  createMockLogger,
  createMockProductRepository,
} from '../../../../mocks';

describe('GetProductsByCategoryService', () => {
  let service: GetProductsByCategoryService;
  let mockProductRepository: ReturnType<typeof createMockProductRepository>;
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(async () => {
    mockProductRepository = createMockProductRepository();
    mockLogger = createMockLogger();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsByCategoryService,
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

    service = module.get<GetProductsByCategoryService>(
      GetProductsByCategoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should return empty categories when there are no products', async () => {
      mockProductRepository.countByCategory.mockResolvedValue([]);
      mockProductRepository.countActive.mockResolvedValue(0);

      const result = await service.execute();

      expect(result).toEqual({
        totalProducts: 0,
        totalCategories: 0,
        categories: [],
      });
    });

    it('should handle single category correctly', async () => {
      mockProductRepository.countByCategory.mockResolvedValue([
        { category: 'Electronics', count: 20 },
      ]);
      mockProductRepository.countActive.mockResolvedValue(20);

      const result = await service.execute();

      expect(result).toEqual({
        totalProducts: 20,
        totalCategories: 1,
        categories: [{ category: 'Electronics', count: 20, percentage: 100.0 }],
      });
    });

    it('should handle decimal percentages correctly', async () => {
      mockProductRepository.countByCategory.mockResolvedValue([
        { category: 'Electronics', count: 15 },
        { category: 'Accessories', count: 2 },
      ]);
      mockProductRepository.countActive.mockResolvedValue(17);

      const result = await service.execute();

      expect(result).toEqual({
        totalProducts: 17,
        totalCategories: 2,
        categories: [
          { category: 'Electronics', count: 15, percentage: 88.24 },
          { category: 'Accessories', count: 2, percentage: 11.76 },
        ],
      });
    });

    it('should return 0% when total products is zero but categories exist', async () => {
      mockProductRepository.countByCategory.mockResolvedValue([
        { category: 'Electronics', count: 0 },
      ]);
      mockProductRepository.countActive.mockResolvedValue(0);

      const result = await service.execute();

      expect(result).toEqual({
        totalProducts: 0,
        totalCategories: 1,
        categories: [{ category: 'Electronics', count: 0, percentage: 0 }],
      });
    });
  });
});

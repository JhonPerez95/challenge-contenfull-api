import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsByDateRangeService } from 'src/application/use-cases/reports/get-products-by-date-range.service';
import { PRODUCT_REPOSITORY } from 'src/domain/repositories/product.repository';
import { AppLoggerService } from 'src/infrastructure/logging/logger.service';

import {
  createMockLogger,
  createMockProductRepository,
} from '../../../../mocks';

describe('GetProductsByDateRangeService', () => {
  let service: GetProductsByDateRangeService;
  let mockProductRepository: ReturnType<typeof createMockProductRepository>;
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(async () => {
    mockProductRepository = createMockProductRepository();
    mockLogger = createMockLogger();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsByDateRangeService,
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

    service = module.get<GetProductsByDateRangeService>(
      GetProductsByDateRangeService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    // it('should calculate date range report correctly', async () => {
    //   const startDate = new Date('2024-11-01');
    //   const endDate = new Date('2024-11-17');

    //   mockProductRepository.countByDateRange.mockResolvedValue(20);
    //   mockProductRepository.countActiveByDateRange.mockResolvedValue(17);
    //   mockProductRepository.countDeletedByDateRange.mockResolvedValue(3);

    //   const result = await service.execute({ startDate, endDate });

    //   expect(result).toEqual({
    //     startDate,
    //     endDate,
    //     totalProducts: 20,
    //     activeProducts: 17,
    //     deletedProducts: 3,
    //   });
    //   expect(mockProductRepository.countByDateRange).toHaveBeenCalledWith({
    //     startDate,
    //     endDate,
    //   });
    //   expect(mockProductRepository.countActiveByDateRange).toHaveBeenCalledWith(
    //     {
    //       startDate,
    //       endDate,
    //     },
    //   );
    //   expect(
    //     mockProductRepository.countDeletedByDateRange,
    //   ).toHaveBeenCalledWith({
    //     startDate,
    //     endDate,
    //   });
    // });

    it('should return 0 when no products in date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      mockProductRepository.countByDateRange.mockResolvedValue(0);
      mockProductRepository.countActiveByDateRange.mockResolvedValue(0);
      mockProductRepository.countDeletedByDateRange.mockResolvedValue(0);

      const result = await service.execute({ startDate, endDate });

      expect(result).toEqual({
        startDate,
        endDate,
        totalProducts: 0,
        activeProducts: 0,
        deletedProducts: 0,
      });
    });

    it('should handle all products active in date range', async () => {
      const startDate = new Date('2024-11-01');
      const endDate = new Date('2024-11-30');

      mockProductRepository.countByDateRange.mockResolvedValue(15);
      mockProductRepository.countActiveByDateRange.mockResolvedValue(15);
      mockProductRepository.countDeletedByDateRange.mockResolvedValue(0);

      const result = await service.execute({ startDate, endDate });

      expect(result).toEqual({
        startDate,
        endDate,
        totalProducts: 15,
        activeProducts: 15,
        deletedProducts: 0,
      });
    });

    it('should handle all products deleted in date range', async () => {
      const startDate = new Date('2024-11-01');
      const endDate = new Date('2024-11-30');

      mockProductRepository.countByDateRange.mockResolvedValue(10);
      mockProductRepository.countActiveByDateRange.mockResolvedValue(0);
      mockProductRepository.countDeletedByDateRange.mockResolvedValue(10);

      const result = await service.execute({ startDate, endDate });

      expect(result).toEqual({
        startDate,
        endDate,
        totalProducts: 10,
        activeProducts: 0,
        deletedProducts: 10,
      });
    });

    it('should handle single day date range', async () => {
      const startDate = new Date('2024-11-17T00:00:00.000Z');
      const endDate = new Date('2024-11-17T23:59:59.999Z');

      mockProductRepository.countByDateRange.mockResolvedValue(5);
      mockProductRepository.countActiveByDateRange.mockResolvedValue(4);
      mockProductRepository.countDeletedByDateRange.mockResolvedValue(1);

      const result = await service.execute({ startDate, endDate });

      expect(result).toEqual({
        startDate,
        endDate,
        totalProducts: 5,
        activeProducts: 4,
        deletedProducts: 1,
      });
    });
  });
});

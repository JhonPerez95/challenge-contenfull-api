import { Test, TestingModule } from '@nestjs/testing';
import { GetDeletedPercentageService } from 'src/application/use-cases/reports/get-deleted-percentage.service';
import { PRODUCT_REPOSITORY } from 'src/domain/repositories/product.repository';
import { AppLoggerService } from 'src/infrastructure/logging/logger.service';

import {
  createMockLogger,
  createMockProductRepository,
} from '../../../../mocks';

describe('GetDeletedPercentageService', () => {
  let service: GetDeletedPercentageService;
  let mockProductRepository: ReturnType<typeof createMockProductRepository>;
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(async () => {
    mockProductRepository = createMockProductRepository();
    mockLogger = createMockLogger();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDeletedPercentageService,
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

    service = module.get<GetDeletedPercentageService>(
      GetDeletedPercentageService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should calculate deleted percentage correctly', async () => {
      mockProductRepository.getTotalCount.mockResolvedValue(20);
      mockProductRepository.countDeleted.mockResolvedValue(3);

      const result = await service.execute();

      expect(result).toEqual({
        totalProducts: 20,
        deletedProducts: 3,
        deletedPercentage: 15.0,
      });
    });

    it('should return 0% when there are no products', async () => {
      mockProductRepository.getTotalCount.mockResolvedValue(0);
      mockProductRepository.countDeleted.mockResolvedValue(0);

      const result = await service.execute();

      expect(result).toEqual({
        totalProducts: 0,
        deletedProducts: 0,
        deletedPercentage: 0,
      });
    });

    it('should return 100% when all products are deleted', async () => {
      mockProductRepository.getTotalCount.mockResolvedValue(10);
      mockProductRepository.countDeleted.mockResolvedValue(10);

      const result = await service.execute();

      expect(result).toEqual({
        totalProducts: 10,
        deletedProducts: 10,
        deletedPercentage: 100.0,
      });
    });
  });
});

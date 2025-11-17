import { Test, TestingModule } from '@nestjs/testing';
import { GetActivePercentageService } from '../../../../../src/application/use-cases/reports/get-active-percentage.service';
import { PRODUCT_REPOSITORY } from '../../../../../src/domain/repositories/product.repository';
import { AppLoggerService } from '../../../../../src/infrastructure/logging/logger.service';

import {
  createMockLogger,
  createMockProductRepository,
} from '../../../../mocks';

describe('GetActivePercentageService', () => {
  let service: GetActivePercentageService;
  let mockProductRepository: ReturnType<typeof createMockProductRepository>;
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(async () => {
    mockProductRepository = createMockProductRepository();
    mockLogger = createMockLogger();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetActivePercentageService,
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

    service = module.get<GetActivePercentageService>(
      GetActivePercentageService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('should return 0% when there are no active products', async () => {
      mockProductRepository.countActive.mockResolvedValue(0);
      mockProductRepository.countWithPrice.mockResolvedValue(0);
      mockProductRepository.countWithoutPrice.mockResolvedValue(0);

      const result = await service.execute();

      expect(result).toEqual({
        totalActiveProducts: 0,
        withPrice: 0,
        withoutPrice: 0,
        withPricePercentage: 0,
        withoutPricePercentage: 0,
      });
    });

    it('should return 100% with price when all products have price', async () => {
      mockProductRepository.countActive.mockResolvedValue(10);
      mockProductRepository.countWithPrice.mockResolvedValue(10);
      mockProductRepository.countWithoutPrice.mockResolvedValue(0);

      const result = await service.execute();

      expect(result).toEqual({
        totalActiveProducts: 10,
        withPrice: 10,
        withoutPrice: 0,
        withPricePercentage: 100.0,
        withoutPricePercentage: 0,
      });
    });

    it('should return 100% without price when no products have price', async () => {
      mockProductRepository.countActive.mockResolvedValue(10);
      mockProductRepository.countWithPrice.mockResolvedValue(0);
      mockProductRepository.countWithoutPrice.mockResolvedValue(10);

      const result = await service.execute();

      expect(result).toEqual({
        totalActiveProducts: 10,
        withPrice: 0,
        withoutPrice: 10,
        withPricePercentage: 0,
        withoutPricePercentage: 100.0,
      });
    });

    it('should handle decimal percentages correctly', async () => {
      mockProductRepository.countActive.mockResolvedValue(17);
      mockProductRepository.countWithPrice.mockResolvedValue(15);
      mockProductRepository.countWithoutPrice.mockResolvedValue(2);

      const result = await service.execute();

      expect(result).toEqual({
        totalActiveProducts: 17,
        withPrice: 15,
        withoutPrice: 2,
        withPricePercentage: 88.24,
        withoutPricePercentage: 11.76,
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '../../../../src/web-api/controllers/reports/reports.controller';
import {
  DeletedPercentageReport,
  GET_DELETED_PERCENTAGE_USE_CASE,
  IGetDeletedPercentageUseCase,
} from '../../../../src/domain/use-cases/get-deleted-percentage.interface';
import {
  DateRangeReport,
  GET_PRODUCTS_BY_DATE_RANGE_USE_CASE,
  IGetProductsByDateRangeUseCase,
} from '../../../../src/domain/use-cases/get-products-by-date-range.interface';
import {
  GET_PRODUCTS_BY_CATEGORY_USE_CASE,
  IGetProductsByCategoryUseCase,
} from '../../../../src/domain/use-cases/get-products-by-category.interface';
import {
  GET_ACTIVE_PERCENTAGE_USE_CASE,
  IGetActivePercentageUseCase,
} from '../../../../src/domain/use-cases/get-active-percentage.interface';
import { ActivePercentageResponseDto } from 'src/web-api/dtos/reports/active-percentage-response.dto';
import { DateRangeResponseDto } from 'src/web-api/dtos/reports/date-range-response.dto';
import { ProductsByCategoryResponseDto } from 'src/web-api/dtos/reports/products-by-category-response.dto';

const createMockDeletedPercentageUseCase =
  (): IGetDeletedPercentageUseCase => ({
    execute: jest.fn(),
  });
const createMockActivePercentageUseCase = (): IGetActivePercentageUseCase => ({
  execute: jest.fn(),
});
const createMockProductsByDateRangeUseCase =
  (): IGetProductsByDateRangeUseCase => ({
    execute: jest.fn(),
  });
const createMockProductsByCategoryUseCase =
  (): IGetProductsByCategoryUseCase => ({
    execute: jest.fn(),
  });

describe('ReportsController', () => {
  let controller: ReportsController;
  let mockDeletedPercentageUseCase: ReturnType<
    typeof createMockDeletedPercentageUseCase
  >;
  let mockActivePercentageUseCase: ReturnType<
    typeof createMockActivePercentageUseCase
  >;
  let mockProductsByDateRangeUseCase: ReturnType<
    typeof createMockProductsByDateRangeUseCase
  >;
  let mockProductsByCategoryUseCase: ReturnType<
    typeof createMockProductsByCategoryUseCase
  >;

  beforeEach(async () => {
    mockDeletedPercentageUseCase = createMockDeletedPercentageUseCase();
    mockActivePercentageUseCase = createMockActivePercentageUseCase();
    mockProductsByDateRangeUseCase = createMockProductsByDateRangeUseCase();
    mockProductsByCategoryUseCase = createMockProductsByCategoryUseCase();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: GET_DELETED_PERCENTAGE_USE_CASE,
          useValue: mockDeletedPercentageUseCase,
        },
        {
          provide: GET_ACTIVE_PERCENTAGE_USE_CASE,
          useValue: mockActivePercentageUseCase,
        },
        {
          provide: GET_PRODUCTS_BY_DATE_RANGE_USE_CASE,
          useValue: mockProductsByDateRangeUseCase,
        },
        {
          provide: GET_PRODUCTS_BY_CATEGORY_USE_CASE,
          useValue: mockProductsByCategoryUseCase,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDeletedPercentage', () => {
    it('should return deleted percentage', async () => {
      const mockResponse: DeletedPercentageReport = {
        totalProducts: 100,
        deletedProducts: 25,
        deletedPercentage: 25,
      };
      const spyExecute = jest
        .spyOn(mockDeletedPercentageUseCase, 'execute')
        .mockResolvedValue(mockResponse);

      const result = await controller.getDeletedPercentage();

      expect(spyExecute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.deletedPercentage).toBe(25);
    });
  });

  describe('getActivePercentage', () => {
    it('should return active percentage', async () => {
      const mockResponse: ActivePercentageResponseDto = {
        totalActiveProducts: 0,
        withPrice: 0,
        withoutPrice: 0,
        withPricePercentage: 40,
        withoutPricePercentage: 0,
      };
      const spyExecute = jest
        .spyOn(mockActivePercentageUseCase, 'execute')
        .mockResolvedValue(mockResponse);

      const result = await controller.getActivePercentage();

      expect(spyExecute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.withPricePercentage).toBe(40);
    });
  });

  describe('getProductsByDateRange', () => {
    it('should return products by date range', async () => {
      const query = { startDate: '2024-01-01', endDate: '2024-01-31' };
      const expectedQuery = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const mockResponse: DateRangeReport = {
        totalProducts: 10,
        activeProducts: 0,
        deletedProducts: 0,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };
      const spyExecute = jest
        .spyOn(mockProductsByDateRangeUseCase, 'execute')
        .mockResolvedValue(mockResponse);

      const result = await controller.getProductsByDateRange(query);

      expect(spyExecute).toHaveBeenCalledWith({
        startDate: new Date(expectedQuery.startDate),
        endDate: new Date(expectedQuery.endDate),
      });

      expect(result.totalProducts).toBe(10);
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category', async () => {
      const mockResponse: ProductsByCategoryResponseDto = {
        totalProducts: 0,
        totalCategories: 0,
        categories: [{ category: 'Electronics', count: 50, percentage: 50.0 }],
      };
      const spyExecute = jest
        .spyOn(mockProductsByCategoryUseCase, 'execute')
        .mockResolvedValue(mockResponse);

      const result = await controller.getProductsByCategory();

      expect(spyExecute).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
      expect(result.categories[0].category).toBe('Electronics');
    });
  });
});

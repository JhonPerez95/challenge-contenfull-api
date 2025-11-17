import { IProductRepository } from 'src/domain/repositories/product.repository';

export const createMockProductRepository =
  (): jest.Mocked<IProductRepository> => {
    return {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      upsert: jest.fn(),
      findByFilters: jest.fn(),
      countDeleted: jest.fn(),
      countActive: jest.fn(),
      countWithPrice: jest.fn(),
      countWithoutPrice: jest.fn(),
      getTotalCount: jest.fn(),
      countByDateRange: jest.fn(),
      countActiveByDateRange: jest.fn(),
      countDeletedByDateRange: jest.fn(),
      countByCategory: jest.fn(),
    };
  };

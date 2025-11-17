import { IProductRepository } from 'src/domain/repositories/product.repository';

export const createMockProductRepository =
  (): jest.Mocked<IProductRepository> => {
    return {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySku: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsertBySku: jest.fn(),
      getTotalCount: jest.fn(),
      countDeleted: jest.fn(),
      countActive: jest.fn(),
      countWithPrice: jest.fn(),
      countWithoutPrice: jest.fn(),
      countByDateRange: jest.fn(),
      countActiveByDateRange: jest.fn(),
      countDeletedByDateRange: jest.fn(),
      countByCategory: jest.fn(),
    } as any;
  };

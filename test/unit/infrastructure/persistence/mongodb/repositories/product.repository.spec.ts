import { ProductRepository } from '../../../../../../src/infrastructure/persistence/mongodb/repositories/product.repository';
import { createMockLogger } from '../../../../../mocks/logger.mock';
import { Product } from '../../../../../../src/domain/entities/product.entity';
import { DomainError } from '../../../../../../src/domain/exceptions/domain.error';
import { DomainErrorBR } from '../../../../../../src/domain/enums/domain.error.enum';

const createMockProductModel = () => ({
  save: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findOneAndUpdate: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  exec: jest.fn(),
});

const mockProductData = {
  _id: { toString: () => 'id123' },
  sku: 'SKU001',
  name: 'Product 1',
  description: 'Desc',
  price: 100,
  currency: 'USD',
  category: 'Electronics',
  tags: ['tag'],
  images: ['img'],
  inStock: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('ProductRepository', () => {
  let repo: ProductRepository;
  let productModel: {
    save: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findOneAndUpdate: jest.Mock;
    find: jest.Mock;
    countDocuments: jest.Mock;
    aggregate: jest.Mock;
    exec: jest.Mock;
  };
  let logger: ReturnType<typeof createMockLogger>;

  beforeEach(() => {
    productModel = createMockProductModel() as typeof productModel;
    logger = createMockLogger();
    repo = new ProductRepository(productModel as any, logger);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('create', () => {
    it('should create and return product', async () => {
      // Simula correctamente la instancia de Mongoose
      const mockSave = jest.fn().mockResolvedValue(mockProductData);
      function MockModel() {
        return { save: mockSave };
      }
      repo = new ProductRepository(MockModel as any, logger);
      const product = new Product(mockProductData);
      const result = await repo.create(product);
      expect(result).toBeInstanceOf(Product);
      expect(result.sku).toBe('SKU001');
      expect(mockSave).toHaveBeenCalled();
    });
    it('should throw DomainError on duplicate SKU', async () => {
      productModel.save.mockRejectedValue({ code: 11000 });
      productModel.constructor = function () {
        return productModel;
      };
      const product = new Product(mockProductData);
      await expect(repo.create(product)).rejects.toThrow(DomainError);
    });
  });

  describe('findById', () => {
    it('should return product if found', async () => {
      productModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProductData),
      });
      const result = await repo.findById('id123');
      expect(result).toBeInstanceOf(Product);
      expect(result?.sku).toBe('SKU001');
    });
    it('should return null if not found', async () => {
      productModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      const result = await repo.findById('id123');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return product', async () => {
      productModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProductData),
      });
      const result = await repo.update('id123', { name: 'Updated' });
      expect(result).toBeInstanceOf(Product);
      expect(result.name).toBe('Product 1');
    });
    it('should throw DomainError if not found', async () => {
      productModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(repo.update('id123', { name: 'Updated' })).rejects.toThrow(
        DomainError,
      );
    });
  });

  describe('softDelete', () => {
    it('should soft delete product', async () => {
      productModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProductData),
      });
      productModel.findByIdAndUpdate.mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue({ ...mockProductData, deletedAt: new Date() }),
      });
      await expect(repo.softDelete('id123')).resolves.toBeUndefined();
    });
    it('should throw if product not found', async () => {
      productModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(repo.softDelete('id123')).rejects.toThrow(DomainError);
    });
    it('should throw if product already deleted', async () => {
      productModel.findById.mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue({ ...mockProductData, deletedAt: new Date() }),
      });
      await expect(repo.softDelete('id123')).rejects.toThrow(DomainError);
    });
  });

  describe('upsert', () => {
    it('should upsert and return product', async () => {
      productModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProductData),
      });
      const product = new Product(mockProductData);
      const result = await repo.upsert(product);
      expect(result).toBeInstanceOf(Product);
      expect(result.sku).toBe('SKU001');
    });
    it('should throw DomainError on duplicate SKU', async () => {
      productModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockRejectedValue({ code: 11000 }),
      });
      const product = new Product(mockProductData);
      await expect(repo.upsert(product)).rejects.toThrow(DomainError);
    });
  });

  describe('findByFilters', () => {
    it('should return paginated products', async () => {
      productModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockProductData]),
      });
      productModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });
      const filters = {
        name: 'Product',
        category: 'Electronics',
        minPrice: 50,
        maxPrice: 200,
        page: 1,
        limit: 10,
      };
      const result = await repo.findByFilters(filters);
      expect(result.data.length).toBe(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('countDeleted', () => {
    it('should return count of deleted products', async () => {
      productModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(5),
      });
      const result = await repo.countDeleted();
      expect(result).toBe(5);
    });
  });

  describe('countActive', () => {
    it('should return count of active products', async () => {
      productModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(10),
      });
      const result = await repo.countActive();
      expect(result).toBe(10);
    });
  });

  describe('countWithPrice', () => {
    it('should return count of products with price', async () => {
      productModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(7),
      });
      const result = await repo.countWithPrice();
      expect(result).toBe(7);
    });
  });

  describe('countWithoutPrice', () => {
    it('should return count of products without price', async () => {
      productModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(3),
      });
      const result = await repo.countWithoutPrice();
      expect(result).toBe(3);
    });
  });

  describe('getTotalCount', () => {
    it('should return total count of products', async () => {
      productModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(15),
      });
      const result = await repo.getTotalCount();
      expect(result).toBe(15);
    });
  });

  describe('countByDateRange', () => {
    it('should return count of products by date range', async () => {
      productModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(4),
      });
      const result = await repo.countByDateRange({
        startDate: new Date(),
        endDate: new Date(),
      });
      expect(result).toBe(4);
    });
  });

  describe('countActiveByDateRange', () => {
    it('should return count of active products by date range', async () => {
      productModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(2),
      });
      const result = await repo.countActiveByDateRange({
        startDate: new Date(),
        endDate: new Date(),
      });
      expect(result).toBe(2);
    });
  });

  describe('countDeletedByDateRange', () => {
    it('should return count of deleted products by date range', async () => {
      productModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });
      const result = await repo.countDeletedByDateRange({
        startDate: new Date(),
        endDate: new Date(),
      });
      expect(result).toBe(1);
    });
  });

  describe('countByCategory', () => {
    it('should return category counts', async () => {
      productModel.aggregate.mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue([{ category: 'Electronics', count: 5 }]),
      });
      const result = await repo.countByCategory();
      expect(result).toEqual([{ category: 'Electronics', count: 5 }]);
    });
  });
});

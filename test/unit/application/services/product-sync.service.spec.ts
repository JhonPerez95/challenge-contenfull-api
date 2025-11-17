import { Test, TestingModule } from '@nestjs/testing';
import { ProductSyncService } from '../../../../src/application/services/product-sync.service';
import { PRODUCT_REPOSITORY } from '../../../../src/domain/repositories/product.repository';
import {
  CONTENTFUL_SERVICE,
  IContentfulService,
} from '../../../../src/domain/services/contentful.service.interface';
import { AppLoggerService } from '../../../../src/infrastructure/logging/logger.service';

import {
  createMockLogger,
  createMockProduct,
  createMockProductRepository,
} from '../../../mocks';

const createMockContentfulService = () =>
  ({
    getAllProducts: jest.fn(),
    getProductsUpdatedSince: jest.fn(),
  }) as IContentfulService;

describe('ProductSyncService', () => {
  let service: ProductSyncService;
  let mockProductRepository: ReturnType<typeof createMockProductRepository>;
  let mockContentfulService: ReturnType<typeof createMockContentfulService>;
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(async () => {
    mockProductRepository = createMockProductRepository();
    mockContentfulService = createMockContentfulService();
    mockLogger = createMockLogger();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductSyncService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
        {
          provide: CONTENTFUL_SERVICE,
          useValue: mockContentfulService,
        },
        {
          provide: AppLoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ProductSyncService>(ProductSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncProducts', () => {
    it('should sync products successfully', async () => {
      const mockContentfulProducts = [
        {
          sys: {
            id: '1',
            createdAt: '2024-11-01T00:00:00Z',
            updatedAt: '2024-11-01T00:00:00Z',
          },
          fields: {
            sku: 'SKU001',
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            currency: 'USD',
            category: 'Electronics',
            tags: ['electronics'],
            images: ['http://example.com/image1.jpg'],
            inStock: true,
          },
        },
        {
          sys: {
            id: '2',
            createdAt: '2024-11-02T00:00:00Z',
            updatedAt: '2024-11-02T00:00:00Z',
          },
          fields: {
            sku: 'SKU002',
            name: 'Product 2',
            description: 'Description 2',
            price: 200,
            currency: 'USD',
            category: 'Accessories',
            tags: ['accessories'],
            images: ['http://example.com/image2.jpg'],
            inStock: false,
          },
        },
      ];

      const spyGetProductsUpdatedSince = jest
        .spyOn(mockContentfulService, 'getProductsUpdatedSince')
        .mockResolvedValue(mockContentfulProducts);

      const upsertSpy = jest
        .spyOn(mockProductRepository, 'upsert')
        .mockResolvedValue(createMockProduct());

      await service.syncProducts();

      expect(spyGetProductsUpdatedSince).toHaveBeenCalledTimes(1);
      expect(upsertSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle empty products list', async () => {
      const spyGetProductsUpdatedSince = jest
        .spyOn(mockContentfulService, 'getProductsUpdatedSince')
        .mockResolvedValue([]);

      await service.syncProducts();

      expect(spyGetProductsUpdatedSince).toHaveBeenCalledTimes(1);
    });

    it('should sync single product', async () => {
      const mockContentfulProducts = [
        {
          sys: {
            id: '1',
            createdAt: '2024-11-01T00:00:00Z',
            updatedAt: '2024-11-01T00:00:00Z',
          },
          fields: {
            sku: 'SKU001',
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            currency: 'USD',
            category: 'Electronics',
            tags: ['electronics'],
            images: ['http://example.com/image1.jpg'],
            inStock: true,
          },
        },
      ];

      const spyGetProductsUpdatedSince = jest
        .spyOn(mockContentfulService, 'getProductsUpdatedSince')
        .mockResolvedValue(mockContentfulProducts);

      const upsertSpy = jest
        .spyOn(mockProductRepository, 'upsert')
        .mockResolvedValue(createMockProduct());

      await service.syncProducts();

      expect(spyGetProductsUpdatedSince).toHaveBeenCalledTimes(1);
      expect(upsertSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw error when upsert fails', async () => {
      const mockContentfulProducts = [
        {
          sys: {
            id: '1',
            createdAt: '2024-11-01T00:00:00Z',
            updatedAt: '2024-11-01T00:00:00Z',
          },
          fields: {
            sku: 'SKU001',
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            currency: 'USD',
            category: 'Electronics',
            tags: ['electronics'],
            images: ['http://example.com/image1.jpg'],
            inStock: true,
          },
        },
      ];

      jest
        .spyOn(mockContentfulService, 'getProductsUpdatedSince')
        .mockResolvedValue(mockContentfulProducts);

      jest
        .spyOn(mockProductRepository, 'upsert')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(service.syncProducts()).rejects.toThrow(
        'Failed to synchronize products',
      );
    });
  });

  describe('initialSync', () => {
    it('should sync all products on initial sync', async () => {
      const mockContentfulProducts = [
        {
          sys: {
            id: '1',
            createdAt: '2024-11-01T00:00:00Z',
            updatedAt: '2024-11-01T00:00:00Z',
          },
          fields: {
            sku: 'SKU001',
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            currency: 'USD',
            category: 'Electronics',
            tags: ['electronics'],
            images: ['http://example.com/image1.jpg'],
            inStock: true,
          },
        },
        {
          sys: {
            id: '2',
            createdAt: '2024-11-02T00:00:00Z',
            updatedAt: '2024-11-02T00:00:00Z',
          },
          fields: {
            sku: 'SKU002',
            name: 'Product 2',
            description: 'Description 2',
            price: 200,
            currency: 'USD',
            category: 'Accessories',
            tags: ['accessories'],
            images: ['http://example.com/image2.jpg'],
            inStock: false,
          },
        },
      ];

      const spyGetAllProducts = jest
        .spyOn(mockContentfulService, 'getAllProducts')
        .mockResolvedValue(mockContentfulProducts);

      const upsertSpy = jest
        .spyOn(mockProductRepository, 'upsert')
        .mockResolvedValue(createMockProduct());

      await service.initialSync();

      expect(spyGetAllProducts).toHaveBeenCalledTimes(1);
      expect(upsertSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle empty products on initial sync', async () => {
      const spyGetAllProducts = jest
        .spyOn(mockContentfulService, 'getAllProducts')
        .mockResolvedValue([]);

      await service.initialSync();

      expect(spyGetAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should throw error when initial sync fails', async () => {
      const mockContentfulProducts = [
        {
          sys: {
            id: '1',
            createdAt: '2024-11-01T00:00:00Z',
            updatedAt: '2024-11-01T00:00:00Z',
          },
          fields: {
            sku: 'SKU001',
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            currency: 'USD',
            category: 'Electronics',
            tags: ['electronics'],
            images: ['http://example.com/image1.jpg'],
            inStock: true,
          },
        },
      ];

      jest
        .spyOn(mockContentfulService, 'getAllProducts')
        .mockResolvedValue(mockContentfulProducts);

      jest
        .spyOn(mockProductRepository, 'upsert')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(service.initialSync()).rejects.toThrow(
        'Failed to synchronize products',
      );
    });
  });
});

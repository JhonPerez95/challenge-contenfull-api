import { Product } from 'src/domain/entities/product.entity';

export const createMockProduct = (overrides?: Partial<Product>): Product => {
  return new Product({
    id: '123',
    sku: 'SKU001',
    name: 'Product 1',
    description: 'Description 1',
    price: 100,
    currency: 'USD',
    category: 'Electronics',
    tags: ['electronics', 'tech'],
    images: ['http://example.com/image1.jpg'],
    inStock: true,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
    deletedAt: null,
    ...overrides,
  });
};

export const createMockDeletedProduct = (): Product =>
  createMockProduct({
    deletedAt: new Date('2024-11-15'),
  });

export const createMockProductWithoutPrice = (): Product =>
  createMockProduct({
    price: 10,
  });

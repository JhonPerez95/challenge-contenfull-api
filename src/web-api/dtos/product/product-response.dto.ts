import { Product } from 'src/domain/entities/product.entity';

export class ProductResponseDto {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  tags: string[];
  images: string[];
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(product: Product): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = product.id;
    dto.sku = product.sku;
    dto.name = product.name;
    dto.description = product.description;
    dto.price = product.price;
    dto.currency = product.currency;
    dto.category = product.category;
    dto.tags = product.tags;
    dto.images = product.images;
    dto.inStock = product.inStock;
    dto.createdAt = product.createdAt;
    dto.updatedAt = product.updatedAt;
    return dto;
  }
}

export class PaginatedProductsResponseDto {
  data: ProductResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(products: Product[], total: number, page: number, limit: number) {
    this.data = products.map((p) => ProductResponseDto.fromEntity(p));
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}

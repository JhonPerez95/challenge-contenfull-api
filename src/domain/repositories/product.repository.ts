import { Product } from '../entities/product.entity';

/**
 * Filtros para búsqueda de productos
 */
export interface ProductFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
}

/**
 * Resultado paginado genérico
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IProductRepository {
  // CRUD sencillo

  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;

  // Búsqueda con filtros y paginación
  findByFilters(
    filters: ProductFilters,
  ): Promise<PaginatedResult<ProductFilters>>;
  findActiveProducts(): Promise<Product[]>;
  findDeletedProducts(): Promise<Product[]>;

  // Reportes TODO: Por confirmar tipado
  countDeleted(): Promise<number>;
  countActive(): Promise<number>;
  countWithPrice(): Promise<number>;
  countWithoutPrice(): Promise<number>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

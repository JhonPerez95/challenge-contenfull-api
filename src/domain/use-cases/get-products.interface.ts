import { Product } from '../entities/product.entity';
import {
  PaginatedResult,
  ProductFilters,
} from '../repositories/product.repository';

export interface IGetProductsUseCase {
  execute(filters: ProductFilters): Promise<PaginatedResult<Product>>;
}

export const GET_PRODUCTS_USE_CASE = 'GET_PRODUCTS_USE_CASE';

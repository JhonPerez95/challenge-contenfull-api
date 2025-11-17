export interface CategoryReport {
  category: string;
  count: number;
  percentage: number;
}

export interface ProductsByCategoryReport {
  totalProducts: number;
  totalCategories: number;
  categories: CategoryReport[];
}

export interface IGetProductsByCategoryUseCase {
  execute(): Promise<ProductsByCategoryReport>;
}

export const GET_PRODUCTS_BY_CATEGORY_USE_CASE =
  'GET_PRODUCTS_BY_CATEGORY_USE_CASE';

import { DateRangeFilter } from '../repositories/product.repository';

export interface DateRangeReport {
  startDate: Date;
  endDate: Date;
  totalProducts: number;
  activeProducts: number;
  deletedProducts: number;
}

export interface IGetProductsByDateRangeUseCase {
  execute(dateRange: DateRangeFilter): Promise<DateRangeReport>;
}

export const GET_PRODUCTS_BY_DATE_RANGE_USE_CASE =
  'GET_PRODUCTS_BY_DATE_RANGE_USE_CASE';

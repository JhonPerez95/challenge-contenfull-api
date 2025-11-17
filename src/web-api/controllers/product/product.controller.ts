import { Controller, Get, Inject, Query, ValidationPipe } from '@nestjs/common';
import { ProductFilters } from '../../../domain/repositories/product.repository';
import { GetProductsQueryDto } from '../../dtos/product/get-products-query.dto';
import { PaginatedProductsResponseDto } from '../../dtos/product/product-response.dto';
import {
  GET_PRODUCTS_USE_CASE,
  IGetProductsUseCase,
} from '../../../domain/use-cases/get-products.interface';

@Controller('products')
export class ProductController {
  constructor(
    @Inject(GET_PRODUCTS_USE_CASE)
    private readonly getProductsUseCase: IGetProductsUseCase,
  ) {}

  @Get()
  async getProducts(
    @Query(new ValidationPipe({ transform: true }))
    query: GetProductsQueryDto,
  ): Promise<PaginatedProductsResponseDto> {
    const filters: ProductFilters = {
      name: query.name,
      category: query.category,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      page: query.page,
      limit: query.limit,
    };

    const result = await this.getProductsUseCase.execute(filters);

    return new PaginatedProductsResponseDto(
      result.data,
      result.total,
      result.page,
      result.limit,
    );
  }
}

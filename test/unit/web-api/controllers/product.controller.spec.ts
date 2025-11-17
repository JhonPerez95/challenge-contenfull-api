import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../../../src/web-api/controllers/product/product.controller';
import {
  GET_PRODUCTS_USE_CASE,
  IGetProductsUseCase,
} from '../../../../src/domain/use-cases/get-products.interface';
import {
  DELETE_PRODUCT_USE_CASE,
  IDeleteProductUseCase,
} from '../../../../src/domain/use-cases/delete-product.interface';
import { GetProductsQueryDto } from '../../../../src/web-api/dtos/product/get-products-query.dto';
import { PaginatedProductsResponseDto } from '../../../../src/web-api/dtos/product/product-response.dto';
import { createMockProduct } from '../../../mocks/product.mock';

const createMockGetProductsUseCase = (): IGetProductsUseCase => ({
  execute: jest.fn(),
});
const createMockDeleteProductUseCase = (): IDeleteProductUseCase => ({
  execute: jest.fn(),
});

describe('ProductController', () => {
  let controller: ProductController;
  let mockGetProductsUseCase: ReturnType<typeof createMockGetProductsUseCase>;
  let mockDeleteProductUseCase: ReturnType<
    typeof createMockDeleteProductUseCase
  >;

  beforeEach(async () => {
    mockGetProductsUseCase = createMockGetProductsUseCase();
    mockDeleteProductUseCase = createMockDeleteProductUseCase();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: GET_PRODUCTS_USE_CASE,
          useValue: mockGetProductsUseCase,
        },
        {
          provide: DELETE_PRODUCT_USE_CASE,
          useValue: mockDeleteProductUseCase,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const query: GetProductsQueryDto = {
        name: 'Product 1',
        category: 'Electronics',
        minPrice: 50,
        maxPrice: 200,
        page: 1,
        limit: 10,
      };
      const mockProducts = [createMockProduct()];
      const mockResult = {
        data: mockProducts,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      const spyExecute = jest
        .spyOn(mockGetProductsUseCase, 'execute')
        .mockResolvedValue(mockResult);

      const result = await controller.getProducts(query);

      expect(spyExecute).toHaveBeenCalledWith({
        name: query.name,
        category: query.category,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        page: query.page,
        limit: query.limit,
      });
      expect(result).toBeInstanceOf(PaginatedProductsResponseDto);
      expect(result.data.length).toBe(1);
      expect(result.data[0].name).toBe('Product 1');
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('deleteProduct', () => {
    it('should call deleteProductUseCase with correct id', async () => {
      const productId = '123';
      const spyExecute = jest
        .spyOn(mockDeleteProductUseCase, 'execute')
        .mockResolvedValue(undefined);

      await controller.deleteProduct(productId);

      expect(spyExecute).toHaveBeenCalledWith(productId);
      expect(spyExecute).toHaveBeenCalledTimes(1);
    });
  });
});

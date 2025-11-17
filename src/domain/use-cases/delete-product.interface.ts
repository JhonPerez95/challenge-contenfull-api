export interface IDeleteProductUseCase {
  execute(id: string): Promise<void>;
}
export const DELETE_PRODUCT_USE_CASE = 'DELETE_PRODUCT_USE_CASE';

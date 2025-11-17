export interface DeletedPercentageReport {
  totalProducts: number;
  deletedProducts: number;
  deletedPercentage: number;
}

export interface IGetDeletedPercentageUseCase {
  execute(): Promise<DeletedPercentageReport>;
}

export const GET_DELETED_PERCENTAGE_USE_CASE =
  'GET_DELETED_PERCENTAGE_USE_CASE';

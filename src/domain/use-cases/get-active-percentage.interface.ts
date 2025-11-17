export interface ActivePercentageReport {
  totalActiveProducts: number;
  withPrice: number;
  withoutPrice: number;
  withPricePercentage: number;
  withoutPricePercentage: number;
}

export interface IGetActivePercentageUseCase {
  execute(): Promise<ActivePercentageReport>;
}

export const GET_ACTIVE_PERCENTAGE_USE_CASE = 'GET_ACTIVE_PERCENTAGE_USE_CASE';

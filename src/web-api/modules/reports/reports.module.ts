import { Module } from '@nestjs/common';

import { ReportsController } from '../../controllers/reports/reports.controller';

import { MongodbModule } from '../../../infrastructure/modules/mongodb.module';
import { LoggingModule } from '../../../infrastructure/modules/logging.module';
import { AuthModule } from '../../../infrastructure/modules/auth.module';

import { GET_DELETED_PERCENTAGE_USE_CASE } from '../../../domain/use-cases/get-deleted-percentage.interface';
import { GET_PRODUCTS_BY_CATEGORY_USE_CASE } from '../../../domain/use-cases/get-products-by-category.interface';
import { GET_ACTIVE_PERCENTAGE_USE_CASE } from '../../../domain/use-cases/get-active-percentage.interface';
import { GET_PRODUCTS_BY_DATE_RANGE_USE_CASE } from '../../../domain/use-cases/get-products-by-date-range.interface';

import { GetDeletedPercentageService } from '../../../application/use-cases/reports/get-deleted-percentage.service';
import { GetActivePercentageService } from '../../../application/use-cases/reports/get-active-percentage.service';
import { GetProductsByDateRangeService } from '../../../application/use-cases/reports/get-products-by-date-range.service';
import { GetProductsByCategoryService } from '../../../application/use-cases/reports/get-products-by-category.service';

@Module({
  imports: [MongodbModule, LoggingModule, AuthModule],
  controllers: [ReportsController],
  providers: [
    {
      provide: GET_DELETED_PERCENTAGE_USE_CASE,
      useClass: GetDeletedPercentageService,
    },
    {
      provide: GET_ACTIVE_PERCENTAGE_USE_CASE,
      useClass: GetActivePercentageService,
    },
    {
      provide: GET_PRODUCTS_BY_DATE_RANGE_USE_CASE,
      useClass: GetProductsByDateRangeService,
    },
    {
      provide: GET_PRODUCTS_BY_CATEGORY_USE_CASE,
      useClass: GetProductsByCategoryService,
    },
  ],
  exports: [
    GET_DELETED_PERCENTAGE_USE_CASE,
    GET_ACTIVE_PERCENTAGE_USE_CASE,
    GET_PRODUCTS_BY_DATE_RANGE_USE_CASE,
    GET_PRODUCTS_BY_CATEGORY_USE_CASE,
  ],
})
export class ReportsModule {}

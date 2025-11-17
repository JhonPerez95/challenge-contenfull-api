import { Module } from '@nestjs/common';

import { GetDeletedPercentageService } from '../../../application/use-cases/reports/get-deleted-percentage.service';

import { MongodbModule } from '../../../infrastructure/modules/mongodb.module';
import { LoggingModule } from '../../../infrastructure/modules/logging.module';
import { AuthModule } from '../../../infrastructure/modules/auth.module';

import { GET_DELETED_PERCENTAGE_USE_CASE } from '../../../domain/use-cases/get-deleted-percentage.interface';

import { ReportsController } from '../../controllers/reports/reports.controller';

@Module({
  imports: [MongodbModule, LoggingModule, AuthModule],
  controllers: [ReportsController],
  providers: [
    {
      provide: GET_DELETED_PERCENTAGE_USE_CASE,
      useClass: GetDeletedPercentageService,
    },
  ],
  exports: [GET_DELETED_PERCENTAGE_USE_CASE],
})
export class ReportsModule {}

import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { IProductSyncService } from '../../domain/services/product-sync-service.interface';
import { PRODUCT_SYNC_SERVICE } from '../../domain/services/product-sync-service.interface';
import { AppLoggerService } from '../logging/logger.service';

@Injectable()
export class ProductSyncScheduler implements OnModuleInit {
  constructor(
    @Inject(PRODUCT_SYNC_SERVICE)
    private readonly productSyncService: IProductSyncService,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(ProductSyncScheduler.name);
  }
  async onModuleInit() {
    this.logger.log('Running initial product synchronization on startup...');

    try {
      await this.productSyncService.initialSync();
      this.logger.log('Initial synchronization completed successfully');
    } catch (error: any) {
      this.logger.error(
        'Initial synchronization failed',
        error?.stack || JSON.stringify(error),
      );
    }
  }

  // @Cron(CronExpression.EVERY_10_SECONDS) // TEST cada 10 segundos
  @Cron(CronExpression.EVERY_HOUR)
  async handleScheduledSync() {
    this.logger.log('Executing scheduled product synchronization');

    try {
      await this.productSyncService.syncProducts();
      this.logger.log('Scheduled synchronization completed successfully');
    } catch (error: any) {
      this.logger.error(
        'Scheduled synchronization failed',
        error?.stack || JSON.stringify(error),
      );
    }
  }
}

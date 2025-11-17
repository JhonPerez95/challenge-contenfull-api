import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongodbModule } from './infrastructure/modules/mongodb.module';
import { envs } from './infrastructure/config/env';
import { LoggingModule } from './infrastructure/modules/logging.module';
import { ProductModule } from './web-api/modules/product/product.module';
import { ContentfulService } from './infrastructure/external-services/contentful/contentful.service';
import { ContentfulModule } from './infrastructure/modules/contentful.module';
import { ProductSyncService } from './application/services/product-sync.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => envs],
    }),
    ScheduleModule.forRoot(),
    MongodbModule,
    LoggingModule,
    ProductModule,
    ContentfulModule,
  ],
  controllers: [AppController],
  providers: [AppService, ContentfulService, ProductSyncService],
})
export class AppModule {}

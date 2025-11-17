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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => envs],
    }),
    MongodbModule,
    LoggingModule,
    ProductModule,
    ContentfulModule,
  ],
  controllers: [AppController],
  providers: [AppService, ContentfulService],
})
export class AppModule {}

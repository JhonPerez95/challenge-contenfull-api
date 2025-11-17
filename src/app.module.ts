import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongodbModule } from './infrastructure/modules/mongodb.module';
import { envs } from './infrastructure/config/env';
import { LoggingModule } from './infrastructure/modules/logging.module';
import { ProductModule } from './web-api/modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => envs],
    }),
    MongodbModule,
    LoggingModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

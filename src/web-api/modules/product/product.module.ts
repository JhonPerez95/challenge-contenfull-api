import { Module } from '@nestjs/common';
import { GetProductsService } from '../../../application/use-cases/product/get-products.service';
import { GET_PRODUCTS_USE_CASE } from '../../../domain/use-cases/get-products.interface';
import { LoggingModule } from '../../../infrastructure/modules/logging.module';
import { MongodbModule } from '../../../infrastructure/modules/mongodb.module';
import { ProductController } from '../../../web-api/controllers/product/product.controller';

@Module({
  imports: [MongodbModule, LoggingModule],
  controllers: [ProductController],
  providers: [
    {
      provide: GET_PRODUCTS_USE_CASE,
      useClass: GetProductsService,
    },
  ],
})
export class ProductModule {}

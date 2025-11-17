import { Module } from '@nestjs/common';

import { GET_PRODUCTS_USE_CASE } from '../../../domain/use-cases/get-products.interface';
import { DELETE_PRODUCT_USE_CASE } from '../../../domain/use-cases/delete-product.interface';
import { PRODUCT_SYNC_SERVICE } from '../../../domain/services/product-sync-service.interface';

import { GetProductsService } from '../../../application/use-cases/product/get-products.service';
import { DeleteProductService } from '../../../application/use-cases/product/delete-product.service';
import { ProductSyncService } from '../../../application/services/product-sync.service';

import { LoggingModule } from '../../../infrastructure/modules/logging.module';
import { MongodbModule } from '../../../infrastructure/modules/mongodb.module';
import { ContentfulModule } from '../../../infrastructure/modules/contentful.module';

import { ProductController } from '../../../web-api/controllers/product/product.controller';

@Module({
  imports: [MongodbModule, LoggingModule, ContentfulModule],
  controllers: [ProductController],
  providers: [
    {
      provide: GET_PRODUCTS_USE_CASE,
      useClass: GetProductsService,
    },
    {
      provide: DELETE_PRODUCT_USE_CASE,
      useClass: DeleteProductService,
    },
    {
      provide: PRODUCT_SYNC_SERVICE,
      useClass: ProductSyncService,
    },
  ],
  exports: [PRODUCT_SYNC_SERVICE],
})
export class ProductModule {}

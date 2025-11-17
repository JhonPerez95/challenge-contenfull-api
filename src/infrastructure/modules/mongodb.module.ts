import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envs } from '../../config/env';
import {
  ProductDocument,
  ProductSchema,
} from '../persistence/mongodb/schemas/product.schema';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import { ProductRepository } from '../persistence/mongodb/repositories/product.repository';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        uri: envs.DATABASE_URL,
      }),
    }),
    MongooseModule.forFeature([
      { name: ProductDocument.name, schema: ProductSchema },
    ]),
  ],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
  ],
  exports: [MongooseModule, PRODUCT_REPOSITORY],
})
export class MongodbModule {}

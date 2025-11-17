// TODO: Pendiente: por confirmar tipados

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductDocument } from '../schemas/product.schema';
import {
  IProductRepository,
  PaginatedResult,
  ProductFilters,
} from 'src/domain/repositories/product.repository';
import { Product } from 'src/domain/entities/product.entity';
import { DomainError } from 'src/domain/exceptions/domain.error';
import { DomainErrorBR } from 'src/domain/enums/domain.error.enum';
import { AppLoggerService } from 'src/infrastructure/logging/logger.service';

interface ProductDocumentFull extends ProductDocument {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectModel(ProductDocument.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(ProductRepository.name);
  }
  // CURD
  async create(product: Product): Promise<Product> {
    try {
      const doc = new this.productModel(product);
      const saved = await doc.save();
      return this.toEntity(saved);
    } catch (error: any) {
      this.logger.error(
        'Error creating product',
        error?.stack || JSON.stringify(error),
      );
      if (error?.code === 11000) {
        throw new DomainError(DomainErrorBR.PRODUCT_SKU_DUPLICATED);
      }
      throw new DomainError(DomainErrorBR.DATABASE_ERROR);
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const document = await this.productModel.findById(id).exec();
      return document ? this.toEntity(document) : null;
    } catch (error: any) {
      this.logger.error(
        'Error finding product by ID',
        error?.stack || JSON.stringify(error),
      );
      throw new DomainError(DomainErrorBR.DATABASE_ERROR);
    }
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const updated = await this.productModel
        .findByIdAndUpdate(id, product, { new: true })
        .exec();

      if (!updated) {
        this.logger.warn(`Product not found for update: ${id}`);
        throw new DomainError(DomainErrorBR.PRODUCT_NOT_FOUND);
      }

      this.logger.log(`Product updated successfully: ${id}`);
      return this.toEntity(updated);
    } catch (error: any) {
      if (error instanceof DomainError) {
        throw error;
      }

      this.logger.error(
        `Failed to update product: ${id}`,
        error?.stack || JSON.stringify(error),
      );
      throw new DomainError(DomainErrorBR.DATABASE_ERROR);
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      const product = await this.productModel.findById(id).exec();

      if (!product) {
        this.logger.warn(`Product not found for deletion: ${id}`);
        throw new DomainError(DomainErrorBR.PRODUCT_NOT_FOUND);
      }

      if (product.deletedAt) {
        this.logger.warn(`Product already deleted: ${id}`);
        throw new DomainError(DomainErrorBR.PRODUCT_ALREADY_DELETED);
      }

      await this.productModel
        .findByIdAndUpdate(id, { deletedAt: new Date() })
        .exec();

      this.logger.log(`Product soft deleted successfully: ${id}`);
    } catch (error: any) {
      if (error instanceof DomainError) {
        throw error;
      }

      this.logger.error(
        `Failed to soft delete product: ${id}`,
        error?.stack || JSON.stringify(error),
      );
      throw new DomainError(DomainErrorBR.DATABASE_ERROR);
    }
  }

  async upsert(product: Product): Promise<Product> {
    try {
      const updated = await this.productModel
        .findOneAndUpdate({ sku: product.sku }, product, {
          new: true,
          upsert: true,
          runValidators: true,
        })
        .exec();

      return this.toEntity(updated);
    } catch (error: any) {
      this.logger.error(
        `Failed to upsert product: ${product.id}`,
        error?.stack || JSON.stringify(error),
      );

      if (error?.code === 11000) {
        throw new DomainError(DomainErrorBR.PRODUCT_SKU_DUPLICATED);
      }

      throw new DomainError(DomainErrorBR.DATABASE_ERROR);
    }
  }

  // Búsqueda
  async findByFilters(
    filters: ProductFilters,
  ): Promise<PaginatedResult<Product>> {
    this.logger.debug(
      `Finding products with filters: ${JSON.stringify(filters)}`,
    );

    try {
      const query: any = { deletedAt: null };

      if (filters.name) {
        query.name = { $regex: filters.name, $options: 'i' };
      }

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) {
          query.price.$gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          query.price.$lte = filters.maxPrice;
        }
      }

      const skip = (filters.page - 1) * filters.limit;

      const [documents, total] = await Promise.all([
        this.productModel.find(query).skip(skip).limit(filters.limit).exec(),
        this.productModel.countDocuments(query).exec(),
      ]);

      this.logger.debug(`Found ${documents.length} products (total: ${total})`);

      return {
        data: documents.map((doc) => this.toEntity(doc)),
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      };
    } catch (error: any) {
      this.logger.error(
        'Failed to find products by filters',
        error?.stack || JSON.stringify(error),
      );
      throw new DomainError(DomainErrorBR.DATABASE_ERROR);
    }
  }

  findActiveProducts(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
  findDeletedProducts(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  // Reportes
  countDeleted(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  countActive(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  countWithPrice(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  countWithoutPrice(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  /**
   * Convierte un ProductDocument de MongoDB a una entidad Product del dominio
   */
  private toEntity(doc: ProductDocument): Product {
    const docWithTimestamps = doc as ProductDocumentFull;

    return new Product({
      id: docWithTimestamps._id.toString(),
      sku: docWithTimestamps.sku,
      name: docWithTimestamps.name,
      description: docWithTimestamps.description,
      price: docWithTimestamps.price,
      currency: docWithTimestamps.currency,
      category: docWithTimestamps.category,
      tags: docWithTimestamps.tags,
      images: docWithTimestamps.images,
      inStock: docWithTimestamps.inStock,
      createdAt: docWithTimestamps.createdAt,
      updatedAt: docWithTimestamps.updatedAt,
      deletedAt: docWithTimestamps.deletedAt,
    });
  }
}

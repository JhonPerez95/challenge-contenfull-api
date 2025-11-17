import { ContentfulProduct } from '../../domain/interfaces/contentful-product.interface';
import { Product } from '../../domain/entities/product.entity';

export class ProductMapper {
  static fromContentful(contentfulProduct: ContentfulProduct): Product {
    return new Product({
      id: contentfulProduct.sys.id,
      sku: contentfulProduct.fields.sku,
      name: contentfulProduct.fields.name,
      description: contentfulProduct.fields.description,
      price: contentfulProduct.fields.price,
      currency: contentfulProduct.fields.currency,
      category: contentfulProduct.fields.category,
      tags: contentfulProduct.fields.tags,
      images: contentfulProduct.fields.images,
      inStock: contentfulProduct.fields.inStock,
      createdAt: new Date(contentfulProduct.sys.createdAt),
      updatedAt: new Date(contentfulProduct.sys.updatedAt),
      deletedAt: null,
    });
  }
}

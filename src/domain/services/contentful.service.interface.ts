import { ContentfulProduct } from '../interfaces/contentful-product.interface';

export interface IContentfulService {
  getAllProducts(): Promise<ContentfulProduct[]>;

  getProductsUpdatedSince(date: Date): Promise<ContentfulProduct[]>;
}

export const CONTENTFUL_SERVICE = 'CONTENTFUL_SERVICE';

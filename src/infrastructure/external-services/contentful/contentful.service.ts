import { Injectable } from '@nestjs/common';
import * as contentful from 'contentful';

import { AppLoggerService } from '../../logging/logger.service';

import { IContentfulService } from '../../../domain/services/contentful.service.interface';
import { ContentfulProduct } from '../../../domain/interfaces/contentful-product.interface';
import { DomainErrorBR } from '../../../domain/enums/domain.error.enum';
import { DomainError } from '../../../domain/exceptions/domain.error';

import { envs } from '../../../infrastructure/config/env';
import { mockContentfulProducts } from '../../../data/dataFakeContentFul';

@Injectable()
export class ContentfulService implements IContentfulService {
  private client: contentful.ContentfulClientApi<undefined>;
  private productContentType: string;
  private useMock: boolean = true;

  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext(ContentfulService.name);

    try {
      this.client = contentful.createClient({
        space: envs.CONTENTFUL_SPACE_ID,
        accessToken: envs.CONTENTFUL_ACCESS_TOKEN,
        environment: envs.CONTENTFUL_ENVIRONMENT,
      });

      this.productContentType = envs.CONTENTFUL_CONTENT_TYPE;
    } catch (error) {
      this.logger.warn(
        'Contentful client initialization failed, using mock data',
      );
      this.useMock = true;
    }
  }

  async getAllProducts(): Promise<ContentfulProduct[]> {
    if (this.useMock) {
      this.logger.log('Using mock data for getAllProducts');
      return mockContentfulProducts;
    }

    try {
      const response = await this.client.getEntries({
        content_type: this.productContentType,
        limit: 1000,
      });

      return response.items as unknown as ContentfulProduct[];
    } catch (error: any) {
      this.logger.error(
        'Failed to fetch products from Contentful',
        error?.stack || JSON.stringify(error),
      );

      throw new DomainError(DomainErrorBR.CONTENTFUL_FETCH_ERROR);
    }
  }

  async getProductsUpdatedSince(date: Date): Promise<ContentfulProduct[]> {
    if (this.useMock) {
      this.logger.log('Using mock data for getProductsUpdatedSince');
      return mockContentfulProducts;
    }

    try {
      const response = await this.client.getEntries<any>({
        content_type: this.productContentType,
        limit: 1000,
        ...({ 'sys.updatedAt[gte]': date.toISOString() } as any),
      });

      return response.items as unknown as ContentfulProduct[];
    } catch (error: any) {
      this.logger.error(
        'Failed to fetch updated products from Contentful',
        error?.stack || JSON.stringify(error),
      );
      throw new DomainError(DomainErrorBR.CONTENTFUL_FETCH_ERROR);
    }
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggingModule } from './logging.module';
import { CONTENTFUL_SERVICE } from '../../domain/services/contentful.service.interface';
import { ContentfulService } from '../services/contentful.service';

@Module({
  imports: [ConfigModule, LoggingModule],
  providers: [
    {
      provide: CONTENTFUL_SERVICE,
      useClass: ContentfulService,
    },
  ],
  exports: [CONTENTFUL_SERVICE],
})
export class ContentfulModule {}

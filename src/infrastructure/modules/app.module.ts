import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';
import { MongodbModule } from '../persistence/mongodb/mongodb.module';
import { envs } from '../../config/env';
import { LoggingModule } from './logging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => envs],
    }),
    MongodbModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

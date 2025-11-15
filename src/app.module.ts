import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongodbModule } from './infrastructure/persistence/mongodb/mongodb.module';
import { envs } from './config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => envs],
    }),
    MongodbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

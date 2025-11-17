// src/infrastructure/modules/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { AUTH_SERVICE } from '../../domain/services/auth.service.interface';
import { AuthController } from '../../web-api/controllers/auth/auth.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { LoggingModule } from './logging.module';

import { envs } from '../config/env';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: envs.JWT_EXPIRATION },
    }),
    LoggingModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    JwtStrategy,
  ],
  exports: [AUTH_SERVICE],
})
export class AuthModule {}

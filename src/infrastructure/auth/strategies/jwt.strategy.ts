// src/infrastructure/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { envs } from '../../config/env';
import { DomainErrorBR } from '../../../domain/enums/domain.error.enum';
import { DomainError } from '../../../domain/exceptions/domain.error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new DomainError(DomainErrorBR.INVALID_TOKEN);
    }

    return new Promise((resolve) =>
      resolve({
        userId: payload.sub,
        username: payload.username,
        role: payload.role,
      }),
    );
  }
}

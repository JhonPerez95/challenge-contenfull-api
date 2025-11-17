import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IAuthService } from '../../domain/services/auth.service.interface';
import { DomainError } from '../../domain/exceptions/domain.error';
import { DomainErrorBR } from '../../domain/enums/domain.error.enum';
import { AppLoggerService } from '../logging/logger.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: AppLoggerService,
  ) {}

  login(): Promise<{ access_token: string }> {
    const payload = {
      sub: 'admin',
      username: 'admin',
      role: 'admin',
    };

    return Promise.resolve({
      access_token: this.jwtService.sign(payload),
    });
  }

  validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.error('Invalid token', error);
      throw new DomainError(DomainErrorBR.INVALID_TOKEN);
    }
  }
}

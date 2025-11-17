import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
  Get,
} from '@nestjs/common';

import {
  IAuthService,
  AUTH_SERVICE,
} from '../../../domain/services/auth.service.interface';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(): Promise<{ access_token: string }> {
    return this.authService.login();
  }

  // RUTA PROTEGIDA DE EJEMPLO
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(): { message: string } {
    return { message: 'This is a protected route!' };
  }
}

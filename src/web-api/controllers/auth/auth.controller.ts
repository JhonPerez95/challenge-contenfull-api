import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  IAuthService,
  AUTH_SERVICE,
} from '../../../domain/services/auth.service.interface';

import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';

import { LoginResponseDto } from '../../dtos/auth/login-response.dto';
import {
  InternalServerErrorDto,
  UnauthorizedErrorDto,
} from '../../dtos/common/errors.dto';

@ApiTags('Authentication')
@ApiResponse({
  status: 500,
  description: 'Internal server error',
  type: InternalServerErrorDto,
})
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate JWT access token' })
  @ApiResponse({
    status: 200,
    description: 'Token generated successfully',
    type: LoginResponseDto,
  })
  async login(): Promise<LoginResponseDto> {
    return this.authService.login();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test protected route' })
  @ApiResponse({ status: 200, description: 'Access granted' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: UnauthorizedErrorDto,
  })
  getProfile(): { message: string } {
    return { message: 'This is a protected route!' };
  }
}

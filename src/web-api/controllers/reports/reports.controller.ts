import { Controller, Get, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  IGetDeletedPercentageUseCase,
  GET_DELETED_PERCENTAGE_USE_CASE,
} from '../../../domain/use-cases/get-deleted-percentage.interface';
import { DomainErrorBR } from '../../../domain/enums/domain.error.enum';

import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';

import { DeletedPercentageResponseDto } from '../../dtos/reports/deleted-percentage-response.dto';
import {
  InternalServerErrorDto,
  UnauthorizedErrorDto,
} from '../../dtos/common/errors.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized - Invalid or missing JWT token',
  type: UnauthorizedErrorDto,
})
@ApiResponse({
  status: 500,
  description: 'Internal server error',
  type: InternalServerErrorDto,
})
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(
    @Inject(GET_DELETED_PERCENTAGE_USE_CASE)
    private readonly getDeletedPercentageUseCase: IGetDeletedPercentageUseCase,
  ) {}

  @Get('deleted-percentage')
  @ApiResponse({
    status: 200,
    description: 'Deleted products percentage calculated successfully',
    type: DeletedPercentageResponseDto,
  })
  async getDeletedPercentage(): Promise<DeletedPercentageResponseDto> {
    const report = await this.getDeletedPercentageUseCase.execute();
    return DeletedPercentageResponseDto.fromDomain(report);
  }
}

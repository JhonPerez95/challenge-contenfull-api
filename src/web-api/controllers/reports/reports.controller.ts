import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
import {
  GET_ACTIVE_PERCENTAGE_USE_CASE,
  IGetActivePercentageUseCase,
} from '../../../domain/use-cases/get-active-percentage.interface';
import {
  GET_PRODUCTS_BY_DATE_RANGE_USE_CASE,
  IGetProductsByDateRangeUseCase,
} from '../../../domain/use-cases/get-products-by-date-range.interface';

import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';

import { DeletedPercentageResponseDto } from '../../dtos/reports/deleted-percentage-response.dto';
import {
  InternalServerErrorDto,
  UnauthorizedErrorDto,
} from '../../dtos/common/errors.dto';
import { ActivePercentageResponseDto } from '../../dtos/reports/active-percentage-response.dto';
import { DateRangeResponseDto } from '../../dtos/reports/date-range-response.dto';
import { DateRangeQueryDto } from '../../dtos/reports/date-range-query.dto';
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
    @Inject(GET_ACTIVE_PERCENTAGE_USE_CASE)
    private readonly getActivePercentageUseCase: IGetActivePercentageUseCase,
    @Inject(GET_PRODUCTS_BY_DATE_RANGE_USE_CASE)
    private readonly getProductsByDateRangeUseCase: IGetProductsByDateRangeUseCase,
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

  @Get('active-percentage')
  @ApiOperation({
    summary: 'Get active products percentage report (with/without price)',
  })
  @ApiResponse({
    status: 200,
    description: 'Active products percentage calculated successfully',
    type: ActivePercentageResponseDto,
  })
  async getActivePercentage(): Promise<ActivePercentageResponseDto> {
    const report = await this.getActivePercentageUseCase.execute();
    return ActivePercentageResponseDto.fromDomain(report);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get products report by date range' })
  @ApiResponse({
    status: 200,
    description: 'Products report by date range calculated successfully',
    type: DateRangeResponseDto,
  })
  async getProductsByDateRange(
    @Query() query: DateRangeQueryDto,
  ): Promise<DateRangeResponseDto> {
    const dateRange = {
      startDate: new Date(query.startDate),
      endDate: new Date(query.endDate),
    };

    const report = await this.getProductsByDateRangeUseCase.execute(dateRange);
    return DateRangeResponseDto.fromDomain(report);
  }
}

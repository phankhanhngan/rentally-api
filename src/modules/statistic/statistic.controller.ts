import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Response } from 'express';
import { StatisticService } from './statistic.service';
import { Role } from 'src/common/enum/common.enum';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('statistic')
export class StatisticController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly statisticService: StatisticService,
  ) {}

  @Get('landlord/:year')
  @UseGuards(RoleAuthGuard([Role.MOD]))
  async getTotalMonthlyAmountByYearLandlord(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getTotalMonthlyAmountByYearMod(
        year,
        req.user.id,
      );
      res.status(200).json({
        message: 'Get statistic successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getTotalMonthlyAmountByYearLandlord()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('renter/:year')
  @UseGuards(RoleAuthGuard([Role.MOD, Role.USER]))
  async getTotalMonthlyAmountByYearRenter(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getTotalMonthlyAmountByYearUser(
        year,
        req.user.id,
      );
      res.status(200).json({
        message: 'Get statistic successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getTotalMonthlyAmountByYearRenter()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('renter/:year/:month')
  async getPriceDetailByMonth(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    try {
      if (month < 1 || month > 12) {
        throw new BadRequestException('Month invalid!');
      }
      const data = await this.statisticService.getPriceDetailByMonth(
        year,
        month,
        req.user.id,
      );
      res.status(200).json({
        message: 'Get user successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getPriceDetailByMonth()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }
}

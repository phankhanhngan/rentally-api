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

  // MOD
  @Get('revenue/:year')
  @UseGuards(RoleAuthGuard([Role.MOD]))
  async getRevenueMonthlyByYear(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getRevenueMonthlyByYear(
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
        'Calling getRevenueMonthlyByYear()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('rentals/:year')
  @UseGuards(RoleAuthGuard([Role.MOD, Role.ADMIN]))
  async getTRentalsMonthlyByYear(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getTRentalsMonthlyByYear(
        year,
        req.user,
      );
      res.status(200).json({
        message: 'Get statistic successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getTRentalsMonthlyByYear()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('rooms/:roomblockid')
  @UseGuards(RoleAuthGuard([Role.MOD, Role.ADMIN]))
  async getStatisticRoom(
    @Req() req,
    @Res() res: Response,
    @Param('roomblockid', ParseIntPipe) id: number,
  ) {
    try {
      const data = await this.statisticService.getStatisticRoom(req.user, id);
      res.status(200).json({
        message: 'Get statistic successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getStatisticRoom()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('ratings')
  @UseGuards(RoleAuthGuard([Role.MOD, Role.ADMIN]))
  async getTopRooms(@Req() req, @Res() res: Response) {
    try {
      const data = await this.statisticService.getTopRooms(req.user);
      res.status(200).json({
        message: 'Get statistic successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getTopRooms()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('overview')
  @UseGuards(RoleAuthGuard([Role.MOD, Role.ADMIN]))
  async getOverview(@Req() req, @Res() res: Response) {
    try {
      const data = await this.statisticService.getOverview(req.user);
      res.status(200).json({
        message: 'Get statistic successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getOverview()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  // USER
  @Get('cost/:year')
  @UseGuards(RoleAuthGuard([Role.MOD, Role.USER, Role.ADMIN]))
  async getCostMonthlyByYear(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getCostMonthlyByYear(
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
        'Calling getCostMonthlyByYear()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('users/:year')
  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  async getNewUserMonthlyByYearAdmin(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getNewUserMonthlyByYearAdmin(
        year,
      );
      res.status(200).json({
        message: 'Get statistic successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getNewUserMonthlyByYearAdmin()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }
}

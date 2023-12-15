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
  @Get('landlord/money/:year')
  @UseGuards(RoleAuthGuard([Role.MOD]))
  async getTotalMoneyMonthlyByYear(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getTotalMoneyMonthlyByYear(
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
        'Calling getTotalMoneyMonthlyByYear()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('landlord/rentals/:year')
  @UseGuards(RoleAuthGuard([Role.MOD]))
  async getTotaRentalMonthlyByYear(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getTotaRentalMonthlyByYear(
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
        'Calling getTotaRentalMonthlyByYear()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('landlord/rooms/:year')
  @UseGuards(RoleAuthGuard([Role.MOD]))
  async getStatisticRoom(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getStatisticRoom(req.user.id);
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

  @Get('landlord/ratings')
  @UseGuards(RoleAuthGuard([Role.MOD]))
  async getTopRooms(@Req() req, @Res() res: Response) {
    try {
      const data = await this.statisticService.getTopRooms(req.user.id);
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

  @Get('landlord/total')
  @UseGuards(RoleAuthGuard([Role.MOD]))
  async getTotal(@Req() req, @Res() res: Response) {
    try {
      const data = await this.statisticService.getTotal(req.user.id);
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

  // USER
  @Get('renter/:year')
  @UseGuards(RoleAuthGuard([Role.MOD, Role.USER]))
  async getTotalMoneyByYearUser(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getTotalMoneyByYearUser(
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
        'Calling getTotalMoneyByYearUser()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  // ADMIN
  @Get('admin/rentals/:year')
  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  async getTotaRentalMonthlyByYearAdmin(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getTotaRentalMonthlyByYear(year);
      res.status(200).json({
        message: 'Get statistic successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getTotaRentalMonthlyByYearAdmin()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('admin/rooms/:year')
  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  async getStatisticRoomAdmin(
    @Req() req,
    @Res() res: Response,
    @Param('year', ParseIntPipe) year: number,
  ) {
    try {
      if (year < 1990) {
        throw new BadRequestException('Year invalid!');
      }
      const data = await this.statisticService.getStatisticRoom();
      res.status(200).json({
        message: 'Get statistic successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getStatisticRoomAdmin()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('admin/ratings')
  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  async getTopRoomsAdmin(@Req() req, @Res() res: Response) {
    try {
      const data = await this.statisticService.getTopRooms();
      res.status(200).json({
        message: 'Get statistic successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getTopRoomsAdmin()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('admin/total')
  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  async getTotalAdmin(@Req() req, @Res() res: Response) {
    try {
      const data = await this.statisticService.getTotal();
      res.status(200).json({
        message: 'Get statistic successfully',
        status: 'success',
        data: data,
      });
    } catch (error) {
      this.logger.error(
        'Calling getTotalAdmin()',
        error,
        StatisticController.name,
      );
      throw error;
    }
  }

  @Get('admin/users/:year')
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
      const data = await this.statisticService.getNewUserMonthlyByYearAdmin(year);
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

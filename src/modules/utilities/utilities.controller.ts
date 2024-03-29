import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Logger } from 'winston';
import { UtilitiesService } from './utilities.service';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/common/enum/common.enum';
import { Request, Response } from 'express';
import { UtilitiesDTO } from './dtos/UtilitiesDTO';
import { AddUtilityDTO } from './dtos/add-utility.dto';
@Controller('utilities')
export class UtilitiesController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly utilitiesService: UtilitiesService,
  ) {}
  @Get()
  async findAllUtility(
    @Req() req: Request,
    @Res() res: Response,
    @Query('keyword') keyword: string,
  ) {
    try {
      const utilities = await this.utilitiesService.findAllUtility(keyword);
      res.status(200).json({
        status: 'success',
        message: 'Get utilities successfully',
        data: {
          utilities: utilities,
        },
      });
    } catch (error) {
      this.logger.error(
        'Calling findAllUtility()',
        error,
        UtilitiesController.name,
      );
      throw error;
    }
  }
  // @UseGuards()
  @UseGuards(JwtAuthGuard, RoleAuthGuard([Role.ADMIN, Role.MOD]))
  @Post()
  async addUtility(
    @Req() req,
    @Res() res: Response,
    @Body(new ValidationPipe({ transform: true }))
    dto: AddUtilityDTO,
  ) {
    try {
      await this.utilitiesService.addUtility(req.user, dto);
      res.status(200).json({
        status: 'success',
        message: 'Add utility successfully',
      });
    } catch (error) {
      this.logger.error(
        'Calling addUtility()',
        error,
        UtilitiesController.name,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard([Role.ADMIN, Role.MOD]))
  @Put('/:id')
  async updateUtility(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    dto: AddUtilityDTO,
  ) {
    try {
      await this.utilitiesService.updateUtility(req.user, dto, id);
      res.status(200).json({
        status: 'success',
        message: 'Update utility successfully',
      });
    } catch (error) {
      this.logger.error(
        'Calling updateUtility()',
        error,
        UtilitiesController.name,
      );
      throw error;
    }
  }

  @Get('/:id')
  async findUtilityById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
    } catch (error) {
      this.logger.error(
        'Calling findUtilityById()',
        error,
        UtilitiesController.name,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard([Role.ADMIN, Role.MOD]))
  @Delete('/:id')
  async deleteutilityById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.utilitiesService.delete(id);
      res.status(200).json({
        status: 'success',
        message: 'Delete utility successfully',
      });
    } catch (error) {
      this.logger.error(
        'Calling deleteutilityById()',
        error,
        UtilitiesController.name,
      );
      throw error;
    }
  }
}

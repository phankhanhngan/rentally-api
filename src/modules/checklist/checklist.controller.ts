import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChecklistService } from './checklist.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Role } from 'src/common/enum/common.enum';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { CheckListDTO } from './dtos/Checklist.dto';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('checklist')
export class ChecklistController {
  constructor(
    private readonly checklistService: ChecklistService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(RoleAuthGuard([Role.USER]))
  @Post()
  async addToChecklist(
    @Res() res: Response,
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) checkListDTO: CheckListDTO,
  ) {
    try {
      const idLogined = req.user.id;
      await this.checklistService.addToChecklist(checkListDTO, idLogined);
      res.status(200).json({
        message: 'Add to checklist successfully',
        status: 'success',
      });
    } catch (error) {
      this.logger.error(
        'Calling addToChecklist()',
        error,
        ChecklistController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.USER]))
  @Delete()
  async removeOfChecklist(
    @Res() res: Response,
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) checkListDTO: CheckListDTO,
  ) {
    try {
      const idLogined = req.user.id;
      await this.checklistService.removeOfChecklist(checkListDTO, idLogined);
      res.status(200).json({
        message: 'Remove of checklist successfully',
        status: 'success',
      });
    } catch (error) {
      this.logger.error(
        'Calling removeOfChecklist()',
        error,
        ChecklistController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.USER]))
  @Get()
  async findAllMyChecklist(@Res() res: Response, @Req() req) {
    try {
      const idLogined = req.user.id;
      const checklist = await this.checklistService.findAllMyChecklist(
        idLogined,
      );
      res.status(200).json({
        message: 'Get my checklist successfully',
        status: 'success',
        data: checklist,
      });
    } catch (error) {
      this.logger.error(
        'Calling findAllMyChecklist()',
        error,
        ChecklistController.name,
      );
      throw error;
    }
  }
}

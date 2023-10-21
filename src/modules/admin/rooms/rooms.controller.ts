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
import { RoomsService } from './rooms.service';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/common/enum/common.enum';
import { UpdateRoomBlockAdminDTO } from '../roomblocks/dtos/update-room-block-admin.dto';
import { AddRoomAdminDTO } from './dtos/add-room-admin.dto';
import { Request, Response } from 'express';
@UseGuards(JwtAuthGuard)
@Controller('admin/rooms')
export class RoomsController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly roomsService: RoomsService,
  ) {}
  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Post()
  async addRoom(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe({ transform: true }))
    roomDTO: AddRoomAdminDTO,
  ) {
    try {
      res.status(200).json({
        status: 'success',
        message: 'Get room blocks successfully',
        data: {
          room: roomDTO,
        },
      });
    } catch (error) {
      this.logger.error('Calling addRoom()', error, RoomsController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Put('/:id')
  async updateRoom(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    updateRoomBlockDto: UpdateRoomBlockAdminDTO,
  ) {
    try {
    } catch (error) {
      this.logger.error('Calling updateRoom()', error, RoomsController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Get()
  async findAllRoom(
    @Req() req: Request,
    @Res() res: Response,
    @Query('keyword') keyword: string,
  ) {
    try {
    } catch (error) {
      this.logger.error('Calling findAllRoom()', error, RoomsController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Get('/:id')
  async findRoomById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
    } catch (error) {
      this.logger.error('Calling findRoomById()', error, RoomsController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Delete('/:id')
  async deleteRoomById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
    } catch (error) {
      this.logger.error(
        'Calling deleteRoomById()',
        error,
        RoomsController.name,
      );
      throw error;
    }
  }
}

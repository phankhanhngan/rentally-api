import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Logger } from 'winston';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/common/enum/common.enum';
import { ModRoomsService } from './room.service';
import { UpdateRoomModDTO } from './dto/update-room.dto';
import { AddRoomModDTO } from './dto/add-rooms.dto';

@UseGuards(JwtAuthGuard)
@Controller('mod/rooms')
export class ModRoomsController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly modRoomsService: ModRoomsService,
  ) {}

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Post()
  async addRoom(
    @Req() req,
    @Res() res: Response,
    @Body(new ValidationPipe())
    addRoomModDto: AddRoomModDTO,
  ) {
    try {
      await this.modRoomsService.addRooms(addRoomModDto, req.user.id);
      return res.status(200).json({
        status: 'success',
        message: 'Create rooms successfully',
      });
    } catch (error) {
      this.logger.error('Calling addRoom()', error, ModRoomsController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Put('/:id')
  async updateRoom(
    @Req() req,
    @Res() res: Response,
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateRoomModDto: UpdateRoomModDTO,
  ) {
    try {
      await this.modRoomsService.updateRoom(
        id,
        req.user.id,
        updateRoomModDto
      );
      return res.status(200).json({
        status: 'success',
        message: 'Update room successfully',
      });
    } catch (error) {
      this.logger.error('Calling updateRoom()', error, ModRoomsController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Get()
  async findAllRoom(
    @Req() req,
    @Res() res: Response,
    @Query('keyword') keyword: string,
  ) {
    try {
      const roomsDto = await this.modRoomsService.findAllRoom(
        req.user.id,
        keyword,
      );
      return res.status(200).json({
        status: 'success',
        message: 'Get rooms successfully',
        data: roomsDto,
      });
    } catch (error) {
      this.logger.error(
        'Calling findAllRoom()',
        error,
        ModRoomsController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Get('/:id')
  async findRoomById(
    @Req() req,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const roomDto = await this.modRoomsService.findRoomById(id, req.user.id);

      if(!roomDto) {
        throw new BadRequestException(`Can not find room with id=[${id}]`);
      }

      return res.status(200).json({
        status: 'success',
        message: 'Get room by id successfully',
        data: roomDto,
      });
    } catch (error) {
      this.logger.error(
        'Calling findRoomById()',
        error,
        ModRoomsController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Delete('/:id')
  async deleteRoomById(
    @Req() req,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      await this.modRoomsService.deleteRoomById(id, req.user.id);
      return res.status(200).json({
        status: 'success',
        message: 'Delete room successfully',
      });
    } catch (error) {
      this.logger.error(
        'Calling deleteRoomById()',
        error,
        ModRoomsController.name,
      );
      throw error;
    }
  }
}

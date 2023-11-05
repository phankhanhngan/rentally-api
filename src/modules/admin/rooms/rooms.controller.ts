import {
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
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Logger } from 'winston';
import { RoomsService } from './rooms.service';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/common/enum/common.enum';
import { Response } from 'express';
import { UpdateRoomAdminDTO } from './dtos/update-room-admin.dto';
import { AddRoomsAdminDTO } from './dtos/add-rooms-admin.dto';
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
    @Req() req,
    @Res() res: Response,
    @Body(new ValidationPipe({ transform: true }))
    addRoomsDTO: AddRoomsAdminDTO,
  ) {
    try {
      await this.roomsService.addRooms(addRoomsDTO, req.user);
      res.status(200).json({
        status: 'success',
        message: 'Create room successfully',
      });
    } catch (error) {
      this.logger.error('Calling addRoom()', error, RoomsController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Put('/:id')
  async updateRoom(
    @Req() req,
    @Res() res: Response,
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateRoomDto: UpdateRoomAdminDTO,
  ) {
    try {
      await this.roomsService.updateRoom(id, updateRoomDto, req.user);
      res.status(200).json({
        status: 'success',
        message: 'Update room successfully',
      });
    } catch (error) {
      this.logger.error('Calling updateRoom()', error, RoomsController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Get()
  async findAllRoom(@Query('keyword') keyword: string, @Res() res: Response) {
    try {
      const rooms = await this.roomsService.findAllRoom(keyword);
      res.status(200).json({
        status: 'success',
        message: 'Get rooms successfully',
        data: {
          rooms: rooms,
        },
      });
    } catch (error) {
      this.logger.error('Calling findAllRoom()', error, RoomsController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Get('/:id')
  async findRoomById(
    @Req() req,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const { room, roomBlockId } = await this.roomsService.findRoomById(id);
      return res.status(200).json({
        status: 'success',
        message: 'Get room by id successfully',
        data: {
          roomBlockId: roomBlockId,
          room: room,
        },
      });
    } catch (error) {
      this.logger.error('Calling findRoomById()', error, RoomsController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Delete('/:id')
  async deleteRoomById(
    @Param('id') id: string,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      await this.roomsService.deleteRoomById(id);
      return res.status(200).json({
        status: 'success',
        message: 'Delete room successfully',
      });
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

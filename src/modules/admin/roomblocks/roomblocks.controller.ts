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
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Logger } from 'winston';
import { AddRoomBlockAdminDTO } from './dtos/add-room-block-admin.dto';
import { RoomBlocksService } from './roomblocks.service';
import { Role } from 'src/common/enum/common.enum';
import { UpdateRoomBlockAdminDTO } from './dtos/update-room-block-admin.dto';

@UseGuards(JwtAuthGuard)
@Controller('/admin/room-blocks')
export class RoomBlocksController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly roomBlocksService: RoomBlocksService,
  ) {}
  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Post()
  async addRoomBlock(
    @Req() req,
    @Res() res: Response,
    @Body(new ValidationPipe({ transform: true }))
    addRoomBlockDto: AddRoomBlockAdminDTO,
  ) {
    try {
      await this.roomBlocksService.addRoomBlock(req.user, addRoomBlockDto);
      res.status(200).json({
        status: 'success',
        message: 'Create room block successfully',
      });
    } catch (error) {
      this.logger.error(
        'Calling addRoomBlock()',
        error,
        RoomBlocksController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Put('/:id')
  async updateRoomBlock(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    updateRoomBlockDto: UpdateRoomBlockAdminDTO,
  ) {
    try {
      await this.roomBlocksService.updateRoomBlock(
        req.user,
        id,
        updateRoomBlockDto,
      );
      res.status(200).json({
        status: 'success',
        message: 'Update room blocks successfully',
      });
    } catch (error) {
      this.logger.error(
        'Calling updateRoomBlock()',
        error,
        RoomBlocksController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Delete('/:id')
  async deleteRoomBlock(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.roomBlocksService.deleteRoomBlock(id);
      res.status(200).json({
        status: 'success',
        message: 'Delete room block successfully',
      });
    } catch (error) {
      this.logger.error(
        'Calling deleteRoomBlock()',
        error,
        RoomBlocksController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Get('/:id')
  async getRoomBlock(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const roomBlock = await this.roomBlocksService.getRoomBlock(id);
      res.status(200).json({
        status: 'success',
        message: 'Get room block successfully',
        data: {
          roomBlock: roomBlock,
        },
      });
    } catch (error) {
      this.logger.error(
        'Calling getRoomBlock()',
        error,
        RoomBlocksController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Get()
  async getRoomBlockList(
    @Res() res: Response,
    @Query('keyword') keyword: string,
  ) {
    try {
      const roomBlockList = await this.roomBlocksService.getRoomBlockList(
        keyword,
      );
      res.status(200).json({
        status: 'success',
        message: 'Get room blocks successfully',
        data: {
          roomBlocks: roomBlockList,
        },
      });
    } catch (error) {
      this.logger.error(
        'Calling getRoomBlockList()',
        error,
        RoomBlocksController.name,
      );
      throw error;
    }
  }
}

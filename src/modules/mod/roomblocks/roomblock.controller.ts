import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
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
import { ModRoomBlocksService } from './roomblock.service';
import { Role } from 'src/common/enum/common.enum';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Response } from 'express';
import { AddRoomBlockModDTO } from './dtos/add-room-block.dto';
import { UpdateRoomBlockModDTO } from './dtos/update-room-block-admin.dto';

@UseGuards(JwtAuthGuard)
@Controller('mod/room-blocks')
export class ModRoomBlocksController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly modRoomBlocksService: ModRoomBlocksService,
  ) {}
  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Post()
  async addRoomBlock(
    @Req() req,
    @Res() res: Response,
    @Body(new ValidationPipe({ transform: true }))
    AddRoomBlockModDto: AddRoomBlockModDTO,
  ) {
    try {
      await this.modRoomBlocksService.addRoomBlock(
        req.user,
        AddRoomBlockModDto,
      );
      res.status(200).json({
        status: 'success',
        message: 'Create room block successfully',
      });
    } catch (error) {
      this.logger.error(
        'Calling addRoomBlock()',
        error,
        ModRoomBlocksController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Put('/:id')
  async updateRoomBlock(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    UpdateRoomBlocModkDto: UpdateRoomBlockModDTO,
  ) {
    try {
      await this.modRoomBlocksService.updateRoomBlock(
        req.user,
        id,
        UpdateRoomBlocModkDto,
      );
      res.status(200).json({
        status: 'success',
        message: 'Update room blocks successfully',
      });
    } catch (error) {
      this.logger.error(
        'Calling updateRoomBlock()',
        error,
        ModRoomBlocksController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Delete('/:id')
  async deleteRoomBlock(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.modRoomBlocksService.deleteRoomBlock(id);
      res.status(200).json({
        status: 'success',
        message: 'Delete room block successfully',
      });
    } catch (error) {
      this.logger.error(
        'Calling deleteRoomBlock()',
        error,
        ModRoomBlocksController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Get('/:id')
  async getRoomBlock(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const roomBlock = await this.modRoomBlocksService.getRoomBlock(id);
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
        ModRoomBlocksController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.MOD]))
  @Get()
  async getRoomBlockList(
    @Req() req,
    @Res() res: Response,
    @Query('keyword') keyword: string,
  ) {
    try {
      const roomBlockList = await this.modRoomBlocksService.getRoomBlockList(
        keyword,
        req.user.id,
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
        ModRoomBlocksController.name,
      );
      throw error;
    }
  }
}

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/entities';
import { Logger } from 'winston';
import { AddRoomBlockDTO } from './dtos/add-room-block.dto';

@UseGuards(JwtAuthGuard)
@Controller('roomblocks')
export class RoomBlocksController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Post()
  async addRoomBlock(
    @Body(new ValidationPipe({ transform: true }))
    addRoomBlockDto: AddRoomBlockDTO,
  ) {
    try {
      
    } catch (error) {
      this.logger.error(
        'Calling addRoomBlock()',
        error,
        RoomBlocksController.name,
      );
      throw error;
    }
  }
}

import {
  Body,
  Controller,
  Inject,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Logger } from 'winston';
import { AddRoomBlockDTO } from './dtos/add-room-block.dto';
import { RoomBlocksService } from './roomblocks.service';
import { Role } from 'src/entities';

@UseGuards(JwtAuthGuard)
@Controller('admin/room-blocks')
export class RoomBlocksController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly roomBlocksService: RoomBlocksService,
  ) {}
  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Post()
  async addRoomBlock(
    @Body(new ValidationPipe({ transform: true }))
    addRoomBlockDto: AddRoomBlockDTO,
  ) {
    try {
      await this.roomBlocksService.addRoomBlock(addRoomBlockDto);
    } catch (error) {
      this.logger.error(
        'Calling addRoomBlock()',
        error,
        RoomBlocksController.name,
      );
      throw error;
    }
  }

  @Put('/:id')
  async updateRoomBlock(
    @Body(new ValidationPipe({ transform: true }))
    addRoomBlockDto: AddRoomBlockDTO,
  ) {
    try {
      await this.roomBlocksService.addRoomBlock(addRoomBlockDto);
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

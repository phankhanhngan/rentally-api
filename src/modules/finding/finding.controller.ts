import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Query,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { FindingService } from './finding.service';
import { Response } from 'express';
import { FindRoomDTO } from './dtos/find-room.dto';

@Controller('finding')
export class FindingController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly findingService: FindingService,
  ) {}

  @Get()
  async findAllRoom(
    @Req() req,
    @Res() res: Response,
    @Query(new ValidationPipe({ transform: true }))
    findRoomDto: FindRoomDTO,
  ) {
    try {
      const rooms = await this.findingService.findAllRoom(findRoomDto);
      return res.status(200).json({
        status: 'success',
        message: 'Get rooms successfully',
        data: rooms,
      });
    } catch (error) {
      this.logger.error('Calling findAllRoom()', error, FindingController.name);
      throw error;
    }
  }

  @Get('/price')
  async getPrice(@Res() res: Response) {
    try {
      const data = await this.findingService.getPrice();
      return res.status(200).json({
        status: 'success',
        message: 'Get price successfully',
        data: data,
      });
    } catch (error) {
      this.logger.error('Calling getPrice()', error, FindingController.name);
      throw error;
    }
  }

  @Get('/:id')
  async getRoomDetailById(
    @Req() req,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const room = await this.findingService.getRoomDetailById(id);

      if (!room) {
        throw new BadRequestException(`Can not find room with id=[${id}]`);
      }

      return res.status(200).json({
        status: 'success',
        message: 'Get room detail successfully',
        data: room,
      });
    } catch (error) {
      this.logger.error(
        'Calling getRoomDetailById()',
        error,
        FindingController.name,
      );
      throw error;
    }
  }
}

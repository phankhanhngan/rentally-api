import {
  BadRequestException,
  Controller,
  Inject,
  ParseFilePipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Role } from 'src/common/enum/common.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Logger } from 'winston';
import { fileFilter } from '../users/helpers/file-filter.helper';
import { Response } from 'express';
import { AWSService } from './aws.service';
import { ModRoomsService } from '../mod/rooms/room.service';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('aws')
export class AwsController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly awsService: AWSService,
    private readonly roomsService: ModRoomsService,
  ) {}
  @UseGuards(RoleAuthGuard([Role.MOD, Role.ADMIN]))
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, fileFilter))
  async addImageRoom(
    @Query('id') id: string,
    @Req() req,
    @Res() res: Response,
    @UploadedFiles(new ParseFilePipe({}))
    files: Array<Express.Multer.File> | Express.Multer.File,
  ) {
    try {
      if (id && id.length > 0) {
        const room = await this.roomsService.findRoomById(id, req);
        if (!room) {
          throw new BadRequestException(`Can not find room with id=[${id}]`);
        }
      }
      const u_id: string = id && id.length > 0 ? id : uuidv4();

      const urls = await this.awsService.bulkPutObjects(
        `RoomImages/${u_id}`,
        files,
      );
      return res.status(200).json({
        status: 'success',
        message: 'Upload images successfully',
        data: urls,
      });
    } catch (error) {
      this.logger.error('Calling upload()', error, AwsController.name);
      throw error;
    }
  }
}

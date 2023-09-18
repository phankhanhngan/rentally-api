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
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dtos/user.dto';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { FilterMessageDTO } from '../../common/dtos/EntityFillter.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file-filter.helper';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get(':id')
  async getUser(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.getUserById(id);
      const userDto = plainToInstance(UserDTO, user, {
        excludePrefixes: ['password'],
      });
      res.status(200).json({
        message: 'Get user successfully',
        status: 'sucess',
        data: [userDto],
      });
    } catch (error) {
      this.logger.error('Calling getUser()', error, UsersController.name);
      throw error;
    }
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async listByPage(
    @Res() res: Response,
    @Query() filterMessageDto: FilterMessageDTO,
  ) {
    try {
      const response = await this.usersService.listByPage(filterMessageDto);
      res.status(200).json({
        message: `Get page ${filterMessageDto.pageNo} successfully`,
        status: 'success',
        data: response,
      });
    } catch (error) {
      this.logger.error('Calling listByPage()', error, UsersController.name);
      throw error;
    }
  }

  @Post('add')
  @UseInterceptors(FilesInterceptor('photo', 5, fileFilter))
  async addUser(
    @Res() res: Response,
    @Body(new ValidationPipe({ transform: true })) userDto: UserDTO,
    @UploadedFiles()
    files: Array<Express.Multer.File> | Express.Multer.File,
  ) {
    try {
      await this.usersService.addUser(userDto, files);
      res.status(200).json({
        message: 'Added user successfully',
        status: 'sucess',
      });
    } catch (error) {
      this.logger.error('Calling addUser()', error, UsersController.name);
      throw error;
    }
  }

  @Post('update')
  async updateUser(
    @Res() res: Response,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDTO,
  ) {
    try {
      await this.usersService.updateUser(updateUserDto);
      res.status(200).json({
        message: 'Updated user successfully',
        status: 'sucess',
      });
    } catch (error) {
      this.logger.error('Calling updateUser()', error, UsersController.name);
      throw error;
    }
  }

  @Delete(':id')
  async deleteUser(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.usersService.deleteUser(id);
      res.status(200).json({
        message: 'Delete user successfully',
        status: 'sucess',
      });
    } catch (error) {
      this.logger.error('Calling deleteUser()', error, UsersController.name);
      throw error;
    }
  }
}

import {
  BadRequestException,
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
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dtos/user.dto';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UpdateUserDTO } from './dtos/update-user.dto';

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
      const userDto = plainToInstance(UserDTO, user);
      res.status(200).json({
        message: 'Get user successfully',
        status: 'sucess',
        data: [userDto],
      });
    } catch (error) {
      this.logger.error('Calling getUser', error, UsersController.name);
      res.status(200).json({
        message: error.message,
        status: 'failed',
        data: [],
      });
    }
  }

  @Get()
  async listFirstPage(@Res() res: Response) {
    try {
      const users = await this.usersService.listByPage(1, 'id', 'asc', '', 5);
      const usersDto = plainToClass(UserDTO, users);
      res.status(200).json({
        message: 'Get first page sucessfully',
        status: 'success',
        data: [usersDto],
      });
    } catch (error) {
      this.logger.error('Calling listFirstPage()', error, UsersController.name);
      throw error;
    }
  }

  @Get('page/:pageNumber')
  async listByPage(
    @Res() res: Response,
    @Param('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('sortField') sortField: string,
    @Query('sortDir') sortDir: string,
    @Query('keyword') keyword: string,
    @Query('limit') limit: number,
  ) {
    try {
      const users = await this.usersService.listByPage(
        pageNumber,
        sortField,
        sortDir,
        keyword,
        limit,
      );
      const usersDto = plainToClass(UserDTO, users);
      res.status(200).json({
        message: `Get page ${pageNumber} successfully`,
        status: 'success',
        data: [usersDto]
      })
    } catch (error) {
      this.logger.error('Calling listByPage()', error, UsersController.name);
      throw error;
    }
  }

  @Post('add')
  async addUser(
    @Res() res: Response,
    @Body(new ValidationPipe()) userDto: UserDTO,
  ) {
    try {
      await this.usersService.addUser(userDto);
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

import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dtos/user.dto';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file-filter.helper';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/common/enum/common.enum';
import { UpdateCurrentUserDTO } from './dtos/update-current-user.dto';
import { UpdateCurrentUserPasswordDTO } from './dtos/udpdate-current-user-password.dto';
import { BecomeHostDTO } from './dtos/become-host.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('/me')
  async getCurrentUserInfo(@Res() res: Response, @Req() req) {
    try {
      const user = await this.usersService.getUserById(req.user.id);
      const userDto = plainToInstance(UserDTO, user, {
        excludePrefixes: ['password', 'verificationCode'],
      });
      res.status(200).json({
        message: 'Get current user successfully',
        status: 'success',
        data: {
          ...userDto,
        },
      });
    } catch (error) {
      this.logger.error(
        'Calling getCurrentUserInfo()',
        error,
        UsersController.name,
      );
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Get('/mods')
  async getMods(@Res() res: Response) {
    try {
      const mods = await this.usersService.getMods();
      res.status(200).json({
        message: 'Get list MOD users successfully',
        status: 'success',
        data: {
          modList: mods,
        },
      });
    } catch (error) {
      this.logger.error('Calling getMods()', error, UsersController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Get(':id')
  async getUser(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.getUserById(id);
      const userDto = plainToInstance(UserDTO, user, {
        excludePrefixes: ['password', 'verificationCode'],
      });
      res.status(200).json({
        message: 'Get user successfully',
        status: 'success',
        data: userDto,
      });
    } catch (error) {
      this.logger.error('Calling getUser()', error, UsersController.name);
      throw error;
    }
  }

  @Get()
  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  async getUsers(@Res() res: Response, @Query('keyword') keyword: string) {
    try {
      const usersDto = await this.usersService.getUsers(keyword);
      res.status(200).json({
        message: 'Get user successfully',
        status: 'success',
        data: usersDto,
      });
    } catch (error) {
      this.logger.error('Calling getAll()', error, UsersController.name);
      throw error;
    }
  }

  @Post('become-host')
  @UseGuards(RoleAuthGuard([Role.USER]))
  async becomeHost(
    @Req() req,
    @Res() res: Response,
    @Body(new ValidationPipe()) dto: BecomeHostDTO,
  ) {
    try {
      const token = await this.usersService.becomeHost(req.user.id, dto);
      res.status(200).json({
        message: 'Upgrade account to HOST successfully',
        status: 'success',
        token,
      });
    } catch (error) {
      this.logger.error('Calling becomeHost()', error, UsersController.name);
      throw error;
    }
  }

  // @UseGuards(RoleAuthGuard([Role.ADMIN]))
  // @Get()
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async listByPage(
  //   @Res() res: Response,
  //   @Query() filterMessageDto: FilterMessageDTO,
  // ) {
  //   try {
  //     const response = await this.usersService.listByPage(filterMessageDto);
  //     res.status(200).json({
  //       message: `Get page ${filterMessageDto.pageNo} successfully`,
  //       status: 'success',
  //       data: response,
  //     });
  //   } catch (error) {
  //     this.logger.error('Calling listByPage()', error, UsersController.name);
  //     throw error;
  //   }
  // }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Post()
  @UseInterceptors(FileInterceptor('photo', fileFilter))
  async addUser(
    @Res() res: Response,
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) userDto: UserDTO,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    try {
      const idLogin = req.user.id;
      await this.usersService.addUser(userDto, file, idLogin);
      res.status(200).json({
        message: 'Added user successfully',
        status: 'success',
      });
    } catch (error) {
      this.logger.error('Calling addUser()', error, UsersController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo', fileFilter))
  async updateUser(
    @Res() res: Response,
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDTO,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    try {
      const idlogin = req.user.id;
      await this.usersService.updateUser(id, updateUserDto, file, idlogin);
      res.status(200).json({
        message: 'Updated user successfully',
        status: 'success',
      });
    } catch (error) {
      this.logger.error('Calling updateUser()', error, UsersController.name);
      throw error;
    }
  }

  @UseGuards(RoleAuthGuard([Role.ADMIN]))
  @Delete(':id')
  async deleteUser(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.usersService.deleteUser(id);
      res.status(200).json({
        message: 'Delete user successfully',
        status: 'success',
      });
    } catch (error) {
      this.logger.error('Calling deleteUser()', error, UsersController.name);
      throw error;
    }
  }

  @Put('/me')
  @UseInterceptors(FileInterceptor('photo', fileFilter))
  async updateCurrentUserInfo(
    @Res() res: Response,
    @Req() req,
    @Body(new ValidationPipe()) updateCurrentUserDto: UpdateCurrentUserDTO,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    try {
      const token = await this.usersService.updateCurrentUser(
        updateCurrentUserDto,
        file,
        req.user,
      );
      res.status(200).json({
        message: 'Update current user successfully',
        status: 'success',
        token,
      });
    } catch (error) {
      this.logger.error(
        'Calling updateCurrentUserInfo()',
        error,
        UsersController.name,
      );
      throw error;
    }
  }

  @Put('/me/password')
  @UseInterceptors(FileInterceptor('photo', fileFilter))
  async updateCurrentUserPassword(
    @Res() res: Response,
    @Req() req,
    @Body(new ValidationPipe())
    updateCurrentUserPasswordDto: UpdateCurrentUserPasswordDTO,
  ) {
    try {
      await this.usersService.updateCurrentUserPassword(
        updateCurrentUserPasswordDto,
        req.user,
      );
      res.status(200).json({
        message: 'Update current user password successfully',
        status: 'success',
      });
    } catch (error) {
      this.logger.error(
        'Calling updateCurrentUserPassword()',
        error,
        UsersController.name,
      );
      throw error;
    }
  }

  @Delete('/me/disable')
  async disableUser(
    @Res() res: Response,
    @Req() req,
    @Body('password') password: string,
  ) {
    try {
      await this.usersService.disableUser(req.user.id, password);
      res.status(200).json({
        message: 'Disable user successfully',
        status: 'success',
      });
    } catch (error) {
      this.logger.error('Calling disableUser()', error, UsersController.name);
      throw error;
    }
  }
}

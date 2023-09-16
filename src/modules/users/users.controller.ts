import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getUser(id);
  }

  @Get()
  async getAllUsers(@Query('txt') txt: string) {
    if(txt == undefined)
      return await this.usersService.getAllUser();
    return await this.usersService.searchUser(txt);
  }

  @Post()
  async saveUser(@Body(new ValidationPipe()) user: UserDTO) {
    if (user.id == 0) return await this.usersService.addUser(0, user);
    else return await this.usersService.updateUser(0, user);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.deleteUser(id);
  }
}

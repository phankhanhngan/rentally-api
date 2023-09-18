import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}

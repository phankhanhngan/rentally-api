import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities';
import { AWSModule } from '../aws/aws.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [MikroOrmModule.forFeature([User]), AWSModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy],
})
export class AuthModule {}

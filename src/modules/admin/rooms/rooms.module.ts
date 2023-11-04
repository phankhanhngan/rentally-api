import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AWSModule } from 'src/modules/aws/aws.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, RoomBlock, User } from 'src/entities';
import { UsersModule } from 'src/modules/users/users.module';
import { UsersService } from 'src/modules/users/users.service';
import { Utility } from 'src/entities/utility.entity';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    AWSModule,
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([RoomBlock]),
    MikroOrmModule.forFeature([Utility]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, UsersService],
})
export class RoomsModule {}

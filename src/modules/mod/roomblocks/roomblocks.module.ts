import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Room, RoomBlock, User } from 'src/entities';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AWSModule } from 'src/modules/aws/aws.module';
import { UsersService } from 'src/modules/users/users.service';
import { ModRoomBlocksService } from './roomblock.service';
import { ModRoomBlocksController } from './roomblock.controller';

@Module({
  imports: [
    AuthModule,
    AWSModule,
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([RoomBlock]),
    MikroOrmModule.forFeature([Room]),
  ],
  controllers: [ModRoomBlocksController],
  providers: [ModRoomBlocksService, UsersService],
})
export class ModRoomBlocksModule {}

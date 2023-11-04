import { Room, RoomBlock, User } from 'src/entities';
import { RoomBlocksController } from './roomblocks.controller';
import { RoomBlocksService } from './roomblocks.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AWSModule } from 'src/modules/aws/aws.module';
import { UsersService } from 'src/modules/users/users.service';

@Module({
  imports: [
    AuthModule,
    AWSModule,
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([RoomBlock]),
    MikroOrmModule.forFeature([Room]),
  ],
  controllers: [RoomBlocksController],
  providers: [RoomBlocksService, UsersService],
})
export class RoomBlocksModule {}

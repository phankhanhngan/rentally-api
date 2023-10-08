import { RoomBlock, User } from 'src/entities';
import { RoomBlocksController } from './roomblocks.controller';
import { RoomBlocksService } from './roomblocks.service';
import { AuthModule } from '../auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AWSModule } from '../aws/aws.module';

@Module({
  imports: [
    AuthModule,
    AWSModule,
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([RoomBlock]),
  ],
  controllers: [RoomBlocksController],
  providers: [RoomBlocksService, UsersService],
})
export class RoomBlocksModule {}

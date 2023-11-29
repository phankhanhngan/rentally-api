import { Module } from '@nestjs/common';
import { AWSService } from './aws.service';
import { AwsController } from './aws.controller';
import { UsersService } from '../users/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, RoomBlock, User } from 'src/entities';
import { ModRoomsService } from '../mod/rooms/room.service';
import { Utility } from 'src/entities/utility.entity';
import { StripeService } from '../stripe/stripe.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Utility]),
    MikroOrmModule.forFeature([RoomBlock]),
    MikroOrmModule.forFeature([Room]),
  ],
  controllers: [AwsController],
  providers: [AWSService, UsersService, ModRoomsService, StripeService],
  exports: [AWSService],
})
export class AWSModule {}

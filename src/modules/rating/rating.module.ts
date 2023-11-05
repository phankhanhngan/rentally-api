import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AWSModule } from '../aws/aws.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, RoomBlock, User } from 'src/entities';
import { RoomsService } from '../admin/rooms/rooms.service';
import { Utility } from 'src/entities/utility.entity';
import { UsersService } from '../users/users.service';
import { RentalService } from '../rental/rental.service';
import { Rental } from 'src/entities/rental.entity';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    AWSModule,
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([RoomBlock]),
    MikroOrmModule.forFeature([Utility]),
    MikroOrmModule.forFeature([Rental]),
  ],
  providers: [RatingService, RoomsService, UsersService, RentalService],
  controllers: [RatingController],
})
export class RatingModule {}

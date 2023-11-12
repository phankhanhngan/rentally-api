import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { AuthModule } from '../auth/auth.module';
import { AWSModule } from '../aws/aws.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, RoomBlock, User } from 'src/entities';
import { RoomsService } from '../admin/rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { Utility } from 'src/entities/utility.entity';
import { RatingService } from '../rating/rating.service';
import { RentalService } from '../rental/rental.service';
import { RoomRating } from 'src/entities/room-rating.entity';
import { Rental } from 'src/entities/rental.entity';
import { Checklist } from 'src/entities/checklist.entity';

@Module({
  imports: [
    AuthModule,
    AWSModule,
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([RoomBlock]),
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([RoomRating]),
    MikroOrmModule.forFeature([Rental]),
    MikroOrmModule.forFeature([Checklist]),
    MikroOrmModule.forFeature([Utility]),
  ],
  controllers: [ChecklistController],
  providers: [
    ChecklistService,
    RoomsService,
    UsersService,
    RatingService,
    RentalService,
  ],
})
export class ChecklistModule {}

import { Module } from '@nestjs/common';
import { UserRentalService } from './user-rental.service';
import { UserRentalController } from './user-rental.controller';
import { UsersService } from 'src/modules/users/users.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AWSModule } from 'src/modules/aws/aws.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, RoomBlock, User } from 'src/entities';
import { RoomRating } from 'src/entities/room-rating.entity';
import { Rental } from 'src/entities/rental.entity';
import { Checklist } from 'src/entities/checklist.entity';
import { Utility } from 'src/entities/utility.entity';

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
  providers: [UserRentalService, UsersService],
  controllers: [UserRentalController],
})
export class UserRentalModule {}

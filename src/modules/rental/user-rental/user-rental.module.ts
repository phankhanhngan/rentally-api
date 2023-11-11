import { Module } from '@nestjs/common';
import { UserRentalService } from './user-rental.service';
import { UserRentalController } from './user-rental.controller';
import { UsersService } from 'src/modules/users/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, User } from 'src/entities';
import { AWSService } from 'src/modules/aws/aws.service';
import { RentalService } from '../rental.service';
import { RatingService } from 'src/modules/rating/rating.service';
import { RentalDetail } from 'src/entities/rental_detail.entity';
import { Rental } from 'src/entities/rental.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([RentalDetail]),
    MikroOrmModule.forFeature([Rental]),
  ],
  providers: [
    UserRentalService,
    UsersService,
    AWSService,
    RentalService,
    RatingService,
  ],
  controllers: [UserRentalController],
})
export class UserRentalModule {}

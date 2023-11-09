import { Module } from '@nestjs/common';
import { UserRentalService } from './user-rental.service';
import { UserRentalController } from './user-rental.controller';
import { UsersService } from 'src/modules/users/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities';
import { AWSService } from 'src/modules/aws/aws.service';
import { RentalService } from '../rental.service';
import { RatingService } from 'src/modules/rating/rating.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
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

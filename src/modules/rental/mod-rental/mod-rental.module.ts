import { Module } from '@nestjs/common';
import { ModRentalService } from './mod-rental.service';
import { ModRentalController } from './mod-rental.controller';
import { RentalService } from '../rental.service';
import { UsersService } from 'src/modules/users/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities';
import { AWSService } from 'src/modules/aws/aws.service';
import { RatingService } from 'src/modules/rating/rating.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [
    ModRentalService,
    UsersService,
    AWSService,
    RentalService,
    RatingService,
  ],
  controllers: [ModRentalController],
})
export class ModRentalModule {}

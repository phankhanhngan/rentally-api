import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { RatingService } from '../rating/rating.service';
import { RatingModule } from '../rating/rating.module';
import { UsersModule } from '../users/users.module';
import { ChecklistService } from './checklist.service';
import { UsersService } from '../users/users.service';
import { AWSModule } from '../aws/aws.module';
import { RentalModule } from '../rental/rental.module';
import { RentalService } from '../rental/rental.service';
import { MikroORM } from '@mikro-orm/mysql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, User } from 'src/entities';
import { RentalDetail } from 'src/entities/rental_detail.entity';
import { Rental } from 'src/entities/rental.entity';
import { UtilitiesService } from '../utilities/utilities.service';
import { Utility } from 'src/entities/utility.entity';

@Module({
  imports: [
    UsersModule,
    AWSModule,
    RatingModule,
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([RentalDetail]),
    MikroOrmModule.forFeature([Rental]),
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([Utility]),
  ],
  controllers: [ChecklistController],
  providers: [
    ChecklistService,
    RatingService,
    RentalService,
    UsersService,
    UtilitiesService,
  ],
})
export class ChecklistModule {}

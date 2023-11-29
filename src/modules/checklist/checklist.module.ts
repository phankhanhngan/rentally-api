import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { RatingService } from '../rating/rating.service';
import { RatingModule } from '../rating/rating.module';
import { UsersModule } from '../users/users.module';
import { ChecklistService } from './checklist.service';
import { UsersService } from '../users/users.service';
import { AWSModule } from '../aws/aws.module';
import { RentalService } from '../rental/rental.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, User } from 'src/entities';
import { RentalDetail } from 'src/entities/rental_detail.entity';
import { Rental } from 'src/entities/rental.entity';
import { EventGateway } from '../notification/event.gateway';
import { NotificationModule } from '../notification/notification.module';
import { UtilitiesService } from '../utilities/utilities.service';
import { Utility } from 'src/entities/utility.entity';
import { UtilitiesModule } from '../utilities/utilities.module';
import { StripeService } from '../stripe/stripe.service';

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
    NotificationModule,
    UtilitiesModule,
  ],
  controllers: [ChecklistController],
  providers: [
    ChecklistService,
    RatingService,
    RentalService,
    UsersService,
    EventGateway,
    UtilitiesService,
    StripeService,
  ],
})
export class ChecklistModule {}

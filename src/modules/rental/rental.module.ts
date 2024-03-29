import { Module, forwardRef } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RatingService } from '../rating/rating.service';
import { RatingModule } from '../rating/rating.module';
import { RentalService } from './rental.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, User } from 'src/entities';
import { RentalDetail } from 'src/entities/rental_detail.entity';
import { UsersService } from '../users/users.service';
import { AWSService } from '../aws/aws.service';
import { Rental } from 'src/entities/rental.entity';
import { NotificationModule } from '../notification/notification.module';
import { EventGateway } from '../notification/event.gateway';
import { UtilitiesService } from '../utilities/utilities.service';
import { Utility } from 'src/entities/utility.entity';
import { StripeService } from '../stripe/stripe.service';
@Module({
  providers: [
    RentalService,
    RatingService,
    UsersService,
    AWSService,
    EventGateway,
    UtilitiesService,
    StripeService,
  ],
  controllers: [RentalController],
  imports: [
    forwardRef(() => RatingModule),
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([RentalDetail]),
    MikroOrmModule.forFeature([Rental]),
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Utility]),
    NotificationModule,
  ],
})
export class RentalModule {}

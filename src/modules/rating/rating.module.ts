import { Module, forwardRef } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RentalService } from '../rental/rental.service';
import { RentalModule } from '../rental/rental.module';
import { RatingService } from './rating.service';
import { UsersService } from '../users/users.service';
import { Room, User } from 'src/entities';
import { AWSService } from '../aws/aws.service';
import { RentalDetail } from 'src/entities/rental_detail.entity';
import { Rental } from 'src/entities/rental.entity';
import { NotificationModule } from '../notification/notification.module';
import { EventGateway } from '../notification/event.gateway';

@Module({
  imports: [
    forwardRef(() => RentalModule),
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([RentalDetail]),
    MikroOrmModule.forFeature([Rental]),
    NotificationModule
  ],
  providers: [RatingService, RentalService, UsersService, AWSService, EventGateway],
  controllers: [RatingController],
})
export class RatingModule {}

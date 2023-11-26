import { Module } from '@nestjs/common';
import { FindingService } from './finding.service';
import { FindingController } from './finding.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, RoomBlock, User } from 'src/entities';
import { RatingModule } from '../rating/rating.module';
import { RatingService } from '../rating/rating.service';
import { RentalModule } from '../rental/rental.module';
import { RentalService } from '../rental/rental.service';
import { RoomsService } from '../admin/rooms/rooms.service';
import { RoomsModule } from '../admin/rooms/rooms.module';
import { Utility } from 'src/entities/utility.entity';
import { AWSModule } from '../aws/aws.module';
import { AWSService } from '../aws/aws.service';
import { UtilitiesModule } from '../utilities/utilities.module';
import { UtilitiesService } from '../utilities/utilities.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { Rental } from 'src/entities/rental.entity';
import { Province } from 'src/entities/province.entity';
import { District } from 'src/entities/district.entity';
import { RentalDetail } from 'src/entities/rental_detail.entity';
import { NotificationModule } from '../notification/notification.module';
import { EventGateway } from '../notification/event.gateway';
import { Checklist } from 'src/entities/checklist.entity';

@Module({
  imports: [
    RatingModule,
    RentalModule,
    RoomsModule,
    AWSModule,
    UsersModule,
    UtilitiesModule,
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([RoomBlock]),
    MikroOrmModule.forFeature([Utility]),
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Rental]),
    MikroOrmModule.forFeature([Province]),
    MikroOrmModule.forFeature([District]),
    MikroOrmModule.forFeature([RentalDetail]),
    MikroOrmModule.forFeature([Checklist]),
    NotificationModule,
  ],
  providers: [
    FindingService,
    RatingService,
    RentalService,
    RoomsService,
    AWSService,
    UtilitiesService,
    UsersService,
    EventGateway
  ],
  controllers: [FindingController],
})
export class FindingModule {}

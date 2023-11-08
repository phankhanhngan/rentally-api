import { Module } from '@nestjs/common';
import { FindingService } from './finding.service';
import { FindingController } from './finding.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, RoomBlock } from 'src/entities';
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


@Module({
  imports: [
    RatingModule,
    RentalModule,
    RoomsModule,
    AWSModule,
    UtilitiesModule,
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([RoomBlock]),
    MikroOrmModule.forFeature([Utility]),
  ],
  providers: [FindingService, RatingService, RentalService, RoomsService, AWSService, UtilitiesService],
  controllers: [FindingController],
})
export class FindingModule {}

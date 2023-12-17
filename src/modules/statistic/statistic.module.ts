import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, RoomBlock, User } from 'src/entities';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AWSModule } from '../aws/aws.module';
import { StripeService } from '../stripe/stripe.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { Utility } from 'src/entities/utility.entity';
import { RoomBlocksService } from '../admin/roomblocks/roomblocks.service';

@Module({
  imports: [
    UsersModule,
    AWSModule,
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Utility, RoomBlock, Room])
  ],
  controllers: [StatisticController],
  providers: [StatisticService, UsersService, StripeService, UtilitiesService],
})
export class StatisticModule {}

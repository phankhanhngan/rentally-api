import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AWSModule } from '../aws/aws.module';
import { StripeService } from '../stripe/stripe.service';

@Module({
  imports: [
    UsersModule,
    AWSModule,
    MikroOrmModule.forFeature([User])
  ],
  controllers: [StatisticController],
  providers: [StatisticService, UsersService, StripeService],
})
export class StatisticModule {}
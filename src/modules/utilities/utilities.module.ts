import { Module } from '@nestjs/common';
import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';
import { AuthModule } from '../auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities';
import { Utility } from 'src/entities/utility.entity';
import { UsersService } from '../users/users.service';
import { AWSModule } from '../aws/aws.module';
import { StripeService } from '../stripe/stripe.service';

@Module({
  imports: [
    AuthModule,
    AWSModule,
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Utility]),
  ],
  controllers: [UtilitiesController],
  providers: [UtilitiesService, UsersService, StripeService],
})
export class UtilitiesModule {}

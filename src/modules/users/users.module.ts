import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities';
import { UsersService } from './users.service';
import { AWSModule } from '../aws/aws.module';
import { AWSService } from '../aws/aws.service';
import { AuthModule } from '../auth/auth.module';
import { StripeService } from '../stripe/stripe.service';

@Module({
  imports: [AuthModule, AWSModule, MikroOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AWSService, StripeService],
})
export class UsersModule {}

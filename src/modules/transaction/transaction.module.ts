import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PaymentService } from '../payment/payment.service';
import { TransactionController } from './transaction.controller';
import { UsersService } from '../users/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities';
import { AWSService } from '../aws/aws.service';
import { StripeService } from '../stripe/stripe.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [TransactionService, UsersService, AWSService, StripeService],
  controllers: [TransactionController],
})
export class TransactionModule {}

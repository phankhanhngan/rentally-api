import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PaymentService } from '../payment/payment.service';

@Module({
  providers: [TransactionService],
})
export class TransactionModule {}

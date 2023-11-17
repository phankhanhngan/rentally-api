import { EntityManager } from '@mikro-orm/mysql';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TransactionDTO } from './dtos/create-transaction.dto';
import { PaymentService } from '../payment/payment.service';
import { Payment } from 'src/entities/payment.entity';
import { plainToInstance } from 'class-transformer';
import { Transaction } from 'src/entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly em: EntityManager,
  ) {}
  async createTransaction(
    dto: TransactionDTO,
    paymentId: number,
    rentalId: number,
    renterId: number,
  ) {
    try {
      const transaction = plainToInstance(Transaction, dto);
      transaction.paymentId = paymentId;
      transaction.rentalId = rentalId;
      transaction.created_at = new Date();
      transaction.created_id = renterId;
      transaction.deleted_at = null;
      transaction.updated_at = new Date();
      transaction.updated_id = renterId;
      await this.em.persistAndFlush(transaction);
    } catch (error) {
      this.logger.error(
        'Calling createTransaction()',
        error,
        TransactionService.name,
      );
    }
  }
}

import { EntityManager } from '@mikro-orm/mysql';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TransactionDTO } from './dtos/create-transaction.dto';
import { PaymentService } from '../payment/payment.service';
import { Payment } from 'src/entities/payment.entity';
import { plainToInstance } from 'class-transformer';
import { Transaction } from 'src/entities/transaction.entity';
import { use } from 'passport';
import { Role } from 'src/common/enum/common.enum';

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
      throw error;
    }
  }
  async findMyTransaction(keyword: string, req: any) {
    try {
      if (!keyword) keyword = '';
      keyword = `%${keyword}%`;
      let query = `SELECT t.id, t.description,  t.status, t.created_at
        # u1: payment, u2: rental
        FROM rentally.transactions t 
        left outer join rentally.payments p on p.id = t.payment_id
        left outer join rentally.rental r on r.id = t.rental_id 
        left outer join rentally.rental r2 on r2.id = p.rental_id 
        left outer join rentally.users u1 on u1.id = r2.renter_id 
        left outer join rentally.users u2 on u2.id = r.renter_id 
        where
            CASE
                WHEN t.payment_id is not null THEN u1.id = :id
                WHEN t.rental_id is not null THEN u2.id = :id
            END
        order by t.created_at desc
        `;
      const qb = this.em.getKnex().raw(query, { id: req.user.id });
      const res = await this.em.execute(qb);
      return res;
    } catch (error) {
      this.logger.error(
        'Calling findMyTransaction()',
        error,
        TransactionService.name,
      );
      throw error;
    }
  }
  async findAll(keyword: string, req: any) {
    try {
      if (!keyword) keyword = '';
      keyword = `%${keyword}%`;
      let query = `	SELECT t.id, t.description,  t.status, t.created_at,
      IFNULL(t.payment_id,0) as payment_id,
      IFNULL(t.rental_id,0) as rental_id,
      CASE
      WHEN t.payment_id is not null THEN concat(u1.first_name, ' ', u1.last_name)
          WHEN t.rental_id is not null THEN concat(u2.first_name, ' ', u2.last_name)
          ELSE ''
      END as renterName,
        CASE
        WHEN t.payment_id is not null THEN u1.phone_number
            WHEN t.rental_id is not null THEN u2.phone_number
            ELSE ''
      END as phone
        # u1: payment, u2: rental
        FROM rentally.transactions t 
        left outer join rentally.payments p on p.id = t.payment_id
        left outer join rentally.rental r on r.id = t.rental_id 
        left outer join rentally.rental r2 on r2.id = p.rental_id 
        left outer join rentally.users u1 on u1.id = r2.renter_id 
        left outer join rentally.users u2 on u2.id = r.renter_id 
        left outer join rentally.users u3 on u3.id = r2.landlord_id 
        left outer join rentally.users u4 on u4.id = r.landlord_id
        where
        (t.description like :keyword
        or u1.first_name
        or t.status like :keyword
        or p.month like :keyword
        or p.year like :keyword
        or YEAR(t.created_at) like :keyword
        or MONTH(t.created_at) like :keyword
        or DAY(t.created_at) like :keyword
        or u1.phone_number like :keyword
        or concat(u1.first_name, ' ', u1.last_name) like :keyword
        or u2.phone_number like :keyword
        or concat(u2.first_name, ' ', u2.last_name) like :keyword)
        `;
      if (req.user.role === Role.USER) {
        query += `
        and 
            CASE
                WHEN t.payment_id is not null THEN u1.id = :id
                WHEN t.rental_id is not null THEN u2.id = :id
            END
            order by t.created_at desc
        `;
      } else if (req.user.role === Role.MOD) {
        query += `
        and 
            CASE
                WHEN t.payment_id is not null THEN u3.id = :id
                WHEN t.rental_id is not null THEN u4.id = :id
            END
            order by t.created_at desc
        `;
      } else {
        query += `
        order by t.created_at desc`;
      }
      const qb = this.em
        .getKnex()
        .raw(query, { keyword: keyword, id: req.user.id });
      const res = await this.em.execute(qb);
      return res;
    } catch (error) {
      this.logger.error('Calling findAll()', error, TransactionService.name);
      throw error;
    }
  }
}

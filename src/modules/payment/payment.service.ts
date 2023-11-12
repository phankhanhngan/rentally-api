import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePaymentDTO } from './dtos/create-payment.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Payment } from 'src/entities/payment.entity';
import { Rental } from 'src/entities/rental.entity';
import { PaymentStatus, RentalStatus, Role } from 'src/common/enum/common.enum';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RentalService } from '../rental/rental.service';
import { UpdatePaymentDTO } from './dtos/update-payment.dto';
import { PaymentDTO } from './dtos/payment.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly em: EntityManager,
    private readonly rentalService: RentalService,
    @InjectRepository(Payment)
    private readonly paymentRepository: EntityRepository<Payment>,
  ) {}
  async findAll(userLogined: any, keyword: string) {
    try {
      let payments = [];
      if (!keyword) keyword = '';
      const likeQr = { $like: `%${keyword}%` };
      const queryObj = {
        $or: [
          {
            rental: {
              $or: [
                {
                  landlord: {
                    $or: [
                      { firstName: likeQr },
                      { lastName: likeQr },
                      { phoneNumber: likeQr },
                    ],
                  },
                },
                {
                  renter: {
                    $or: [
                      { firstName: likeQr },
                      { lastName: likeQr },
                      { phoneNumber: likeQr },
                    ],
                  },
                },
                {
                  room: {
                    $or: [
                      {
                        roomblock: {
                          $or: [
                            { description: likeQr },
                            { address: likeQr },
                            { city: likeQr },
                            { country: likeQr },
                            { district: likeQr },
                          ],
                        },
                      },
                      { roomName: likeQr },
                    ],
                  },
                },
              ],
            },
          },
          { year: likeQr },
          { month: likeQr },
          { additionalPrice: likeQr },
          { totalWaterPrice: likeQr },
          { waterNumber: likeQr },
          { totalElectricPrice: likeQr },
          { electricNumber: likeQr },
          { totalPrice: likeQr },
          { status: likeQr },
        ],
      };
      if (userLogined.role === Role.MOD) {
        queryObj['rental'] = {
          landlord: { id: userLogined.id },
        };
      }

      return await this.em.find(Payment, queryObj);
    } catch (error) {
      this.logger.error('Calling findAll()', error, PaymentService.name);
      throw error;
    }
  }
  async findByIdRtn(user: any, paymentId: number) {
    try {
      let payment: Payment;
      if (user.role === Role.MOD) {
        payment = await this.findByIdAndLandLord(paymentId, user.id);
      }
      if (user.role === Role.ADMIN) {
        payment = await this.findById(paymentId);
      }
      if (!payment) {
        throw new BadRequestException(
          'Can not find this payment or you are not own this payment',
        );
      }
      const paymentDTO = plainToInstance(PaymentDTO, payment);
      paymentDTO.rental = payment.rental.id;
      return paymentDTO;
    } catch (error) {
      this.logger.error('Calling findByRentalId()', error, PaymentService.name);
      throw error;
    }
  }
  async findByRentalIdMonthYear(paymentDTO: CreatePaymentDTO) {
    try {
      const payment = await this.em.findOne(Payment, {
        rental: { id: paymentDTO.rental_id },
        month: paymentDTO.month,
        year: paymentDTO.year,
        deleted_at: null,
      });
      return payment;
    } catch (error) {
      this.logger.error('Calling findByRentalId()', error, PaymentService.name);
      throw error;
    }
  }
  async findByIdAndStatus(id: number, status: PaymentStatus) {
    try {
      const payment = await this.em.findOne(
        Payment,
        {
          id: id,
          status: status,
          deleted_at: null,
        },
        {
          populate: ['rental'],
        },
      );
      return payment;
    } catch (error) {
      this.logger.error('Calling findById()', error, PaymentService.name);
      throw error;
    }
  }

  async findByIdAndLandLord(id: number, landlordId: number) {
    try {
      const payment = await this.em.findOne(
        Payment,
        {
          id: id,
          rental: { landlord: { id: landlordId } },
          deleted_at: null,
        },
        {
          populate: ['rental'],
        },
      );
      return payment;
    } catch (error) {
      this.logger.error(
        'Calling findByIdAndLandLord()',
        error,
        PaymentService.name,
      );
      throw error;
    }
  }
  async findById(id: number) {
    try {
      const payment = await this.em.findOne(
        Payment,
        {
          id: id,
          deleted_at: null,
        },
        {
          populate: ['rental'],
        },
      );
      return payment;
    } catch (error) {
      this.logger.error('Calling findById()', error, PaymentService.name);
      throw error;
    }
  }
  async createPayment(paymentDTO: CreatePaymentDTO, idLogined: any) {
    try {
      const rental = await this.rentalService.findByIdAndLandLord(
        paymentDTO.rental_id,
        idLogined,
        RentalStatus.COMPLETED,
      );
      if (!rental)
        throw new BadRequestException(
          'Can not found rental or you are not own this rental!',
        );
      const paymentDb = await this.findByRentalIdMonthYear(paymentDTO);
      if (paymentDb) {
        throw new BadRequestException('You are already create this payment');
      }
      const payment = {
        rental: rental,
        totalPrice: paymentDTO.totalPrice,
        electricNumber: paymentDTO.electricNumber,
        totalElectricPrice: paymentDTO.totalElectricPrice,
        waterNumber: paymentDTO.waterNumber,
        totalWaterPrice: paymentDTO.totalWaterPrice,
        additionalPrice: paymentDTO.additionalPrice,
        month: paymentDTO.month,
        year: paymentDTO.year,
        paidAt: null,
        status: PaymentStatus.UNPAID,
        created_at: new Date(),
        updated_at: new Date(),
        created_id: idLogined,
        updated_id: idLogined,
        deleted_at: null,
      };
      const rentalDetailEntity = this.paymentRepository.create(payment);
      await this.em.persistAndFlush(rentalDetailEntity);
    } catch (error) {
      this.logger.error('Calling createPayment()', error, PaymentService.name);
      throw error;
    }
  }
  async updatePayment(
    paymentDTO: UpdatePaymentDTO,
    idLogined: number,
    paymentId: number,
  ) {
    try {
      const paymentDb = await this.findByIdAndStatus(
        paymentId,
        PaymentStatus.UNPAID,
      );
      if (!paymentDb) {
        throw new BadRequestException(
          `Can not update payment with status: [PAID] or can not found payment with id: [${paymentId}]`,
        );
      }
      const rental = await this.rentalService.findByIdAndLandLord(
        paymentDb.rental.id,
        idLogined,
        RentalStatus.COMPLETED,
      );
      if (!rental)
        throw new BadRequestException(
          'Can not found rental or you are not own this rental!',
        );

      paymentDb.additionalPrice = paymentDTO.additionalPrice;
      paymentDb.electricNumber = paymentDTO.electricNumber;
      paymentDb.month = paymentDTO.month;
      paymentDb.rental = rental;
      paymentDb.totalElectricPrice = paymentDTO.totalElectricPrice;
      paymentDb.totalPrice = paymentDTO.totalPrice;
      paymentDb.totalWaterPrice = paymentDTO.totalWaterPrice;
      paymentDb.updated_at = new Date();
      paymentDb.updated_id = idLogined;
      paymentDb.waterNumber = paymentDTO.waterNumber;
      paymentDb.year = paymentDTO.year;
      await this.em.persistAndFlush(paymentDb);
    } catch (error) {
      this.logger.error('Calling updatePayment()', error, PaymentService.name);
      throw error;
    }
  }
  async deletePayment(paymentId: number) {
    try {
      const paymentDb = await this.findByIdAndStatus(
        paymentId,
        PaymentStatus.UNPAID,
      );
      if (!paymentDb) {
        throw new BadRequestException(
          `Can not delete payment with status: [PAID] or can not found payment with id: [${paymentId}]`,
        );
      }
      paymentDb.deleted_at = new Date();
      await this.em.persistAndFlush(paymentDb);
    } catch (error) {
      this.logger.error('Calling updatePayment()', error, PaymentService.name);
      throw error;
    }
  }
}

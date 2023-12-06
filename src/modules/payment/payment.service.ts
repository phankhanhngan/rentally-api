import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePaymentDTO } from './dtos/create-payment.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Payment } from 'src/entities/payment.entity';
import { Rental } from 'src/entities/rental.entity';
import {
  PaymentStatus,
  RentalStatus,
  Role,
  RoomStatus,
  TransactionStatus,
} from 'src/common/enum/common.enum';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RentalService } from '../rental/rental.service';
import { UpdatePaymentDTO } from './dtos/update-payment.dto';
import { PaymentDTO } from './dtos/payment.dto';
import { plainToInstance } from 'class-transformer';
import Stripe from 'stripe';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionDTO } from '../transaction/dtos/create-transaction.dto';
import { Room, User } from 'src/entities';
import { EventGateway } from '../notification/event.gateway';
import { MailerService } from '@nest-modules/mailer';
import { NotificationDTO } from '../notification/dtos/notification.dto';
import { RenterInformationDTO } from '../notification/dtos/renter-information.dto';
import { PaymentInformationDTO } from '../notification/dtos/payment-information.dto';
import { NotificationService } from '../notification/notification.service';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly em: EntityManager,
    private readonly rentalService: RentalService,
    private readonly transactionService: TransactionService,
    @InjectRepository(Payment)
    private readonly paymentRepository: EntityRepository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly eventGateway: EventGateway,
    private readonly mailerService: MailerService,
    private readonly notificationService: NotificationService,
    private readonly stripeService: StripeService,
  ) {}
  async findMyPayment(user: any) {
    try {
      const payments = await this.em.find(
        Payment,
        {
          rental: { renter: { id: user.id } },
          deleted_at: null,
        },
        {
          populate: [
            'rental',
            'rental.room',
            'rental.room.roomblock',
            'rental.landlord',
            'rental.rentalDetail',
          ],
          orderBy: { status: 'DESC' },
        },
      );
      const paymentDTOs = await Promise.all(
        payments.map(async (payment) => {
          const paymentDTO = plainToInstance(PaymentDTO, payment);
          paymentDTO.rental = await this.rentalService.setRentalDTO(
            payment.rental,
          );
          const expirationDate = new Date(payment.created_at);
          expirationDate.setDate(expirationDate.getDate() + 7);
          paymentDTO.expirationDate = expirationDate;
          return paymentDTO;
        }),
      );
      return paymentDTOs;
    } catch (error) {
      throw error;
    }
  }
  async callBackWebHook(req: any) {
    try {
      const event = req.body;
      switch (event.type) {
        case 'checkout.session.completed':
          const metadata = event.data.object.metadata;
          if (metadata.type === 'CHECKOUT') {
            const payment = await this.updateStatus(metadata.paymentId);

            await this.transactionService.createTransaction(
              {
                description: metadata.description,
                status: TransactionStatus.PAID,
                stripeId: event.data.object.id,
              },
              payment.id,
              null,
              metadata.renterId,
            );
            const landlord = await this.userRepository.findOne({
              id: metadata.landlordId,
            });
            await this.stripeService.payout(landlord, payment.totalPrice);

            await this.transactionService.createTransaction(
              {
                description: `Payout to mod id=[${landlord.id}], with amount=[${payment.totalPrice}] after PAYMENT`,
                status: TransactionStatus.PAYOUT,
                stripeId: event.data.object.id,
              },
              null,
              null,
              metadata.renterId,
            );
            this.mailerService.sendMail({
              to: payment.rental.landlord.email,
              subject: `Payment monthly rent of room ${payment.rental.room.roomName} - roomblock ${payment.rental.room.roomblock.address} in ${payment.month}/${payment.year} was completed`,
              template: './checkout_rental',
              context: {
                payment: payment,
                transaction_link: 'https://rentally.netlify.app/',
              },
            });
          }
          if (metadata.type === 'DEPOSITED') {
            const metadata = event.data.object.metadata;
            const rentalId = metadata.rentalId;
            const rental = await this.em.findOne(
              Rental,
              { id: rentalId },
              { populate: ['room', 'landlord', 'room.roomblock', 'renter'] },
            );
            const room = await this.em.findOne(Room, { id: rental.room.id });

            rental.status = RentalStatus.COMPLETED;
            room.status = RoomStatus.OCCUPIED;
            const dto: TransactionDTO = {
              description: metadata.description,
              status: TransactionStatus.DEPOSITED,
              stripeId: event.data.object.id,
            };
            await this.transactionService.createTransaction(
              dto,
              null,
              rental.id,
              metadata.renterId,
            );
            this.em.persist(rental);
            this.em.persist(room);
            await this.em.flush();

            await this.stripeService.payout(
              rental.landlord,
              Number(rental.room.depositAmount),
            );

            await this.transactionService.createTransaction(
              {
                description: `Payout to mod id=[${rental.landlord.id}], with amount=[${rental.room.depositAmount}] after DEPOSIT`,
                status: TransactionStatus.PAYOUT,
                stripeId: event.data.object.id,
              },
              null,
              null,
              metadata.renterId,
            );

            this.mailerService.sendMail({
              to: rental.landlord.email,
              subject: `Request rent of room ${rental.room.roomName} - roomblock ${rental.room.roomblock.address} was deposited`,
              template: './deposite_rental',
              context: {
                rental: rental,
                transaction_link: 'https://rentally.netlify.app/',
              },
            });
          }
          break;
        case 'invoice.payment_failed' ||
          'charge.failed' ||
          'payment_intent.payment_failed':
          this.logger.error(
            'Calling callBackWebHook()',
            new InternalServerErrorException('Payment failed'),
            PaymentService.name,
          );
          await this.transactionService.createTransaction(
            {
              description: event.type,
              status: TransactionStatus.FAILED,
              stripeId: event.data.object.id,
            },
            null,
            null,
            null,
          );
          break;
        default:
      }
    } catch (error) {
      this.logger.error(
        'Calling callBackWebHook()',
        error,
        PaymentService.name,
      );
      throw error;
    }
  }
  async updateStatus(paymentId: number) {
    try {
      const payment = await this.findById(paymentId);
      if (!payment) {
        throw new BadRequestException('Can not find payment!');
      }
      if (payment.status != PaymentStatus.UNPAID) {
        throw new BadRequestException(
          'Only payment with status UNPAID are accepted!',
        );
      }
      payment.status = PaymentStatus.PAID;
      payment.paidAt = new Date();
      await this.em.persistAndFlush(payment);
      return payment;
    } catch (error) {
      this.logger.error('Calling updateStatus()', error, PaymentService.name);
      throw error;
    }
  }
  async checkOutPayment(paymentId: number, user: any, req: any) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const payment = await this.findByIdAndRenterPopulate(paymentId, user.id);
      if (!payment)
        throw new BadRequestException(
          'Can not find payment or you do not own this payment!',
        );
      if (payment.status != PaymentStatus.UNPAID) {
        throw new BadRequestException(
          'Only payment with status UNPAID can check out',
        );
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        mode: 'payment',
        customer_email: req.user.email,
        client_reference_id: payment.id.toString(),
        metadata: {
          landlordId: payment.rental.landlord.id,
          paymentId: payment.id,
          createdAt: new Date().toDateString(),
          description: `${payment.rental.renter.firstName} ${payment.rental.renter.lastName} transfers money for monthly rent in ${payment.month}/${payment.year}`,
          renterId: user.id,
          type: 'CHECKOUT',
        },
        line_items: [
          {
            price_data: {
              unit_amount: payment.totalPrice,
              currency: process.env.STRIPE_CURRENCY,
              product_data: {
                name: `${payment.rental.room.roomName}`,
                description: `${payment.rental.renter.firstName} ${payment.rental.renter.lastName} transfers money for monthly rent in ${payment.month}/${payment.year}.
                              \nAddress: ${payment.rental.room.roomblock.address} ${payment.rental.room.roomblock.district} ${payment.rental.room.roomblock.city} ${payment.rental.room.roomblock.country}.`,
                images: JSON.parse(payment.rental.room.images),
              },
            },
            quantity: 1,
          },
        ],
      });
      return session;
    } catch (error) {
      this.logger.error(
        'Calling checkOutPayment()',
        error,
        PaymentService.name,
      );
      throw error;
    }
  }
  async findAll(userLogined: any, keyword: string) {
    try {
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

      const payments = await this.em.find(Payment, queryObj, {
        populate: [
          'rental',
          'rental.room',
          'rental.room.roomblock',
          'rental.landlord',
          'rental.rentalDetail',
        ],
      });
      const paymentDTOs = await Promise.all(
        payments.map(async (payment) => {
          const paymentDTO = plainToInstance(PaymentDTO, payment);
          paymentDTO.rental = await this.rentalService.setRentalDTO(
            payment.rental,
          );
          return paymentDTO;
        }),
      );
      return paymentDTOs;
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
      if (user.role === Role.USER) {
        payment = await this.findByIdAndRenterPopulate(paymentId, user.id);
      }
      if (!payment) {
        throw new BadRequestException(
          'Can not find this payment or you are not own this payment',
        );
      }
      const paymentDTO = plainToInstance(PaymentDTO, payment);
      paymentDTO.rental = await this.rentalService.setRentalDTO(payment.rental);
      const expirationDate = new Date(payment.created_at);
      expirationDate.setDate(expirationDate.getDate() + 7);
      paymentDTO.expirationDate = expirationDate;
      return paymentDTO;
    } catch (error) {
      this.logger.error('Calling findByRentalId()', error, PaymentService.name);
      throw error;
    }
  }
  async findByRentalIdMonthYear(paymentDTO: CreatePaymentDTO) {
    try {
      const payment = await this.em.findOne(
        Payment,
        {
          rental: { id: paymentDTO.rental_id },
          month: paymentDTO.month,
          year: paymentDTO.year,
          deleted_at: null,
        },
        { populate: ['rental', 'rental.rentalDetail', 'rental.room'] },
      );
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
          populate: [
            'rental',
            'rental.room',
            'rental.room.roomblock',
            'rental.landlord',
            'rental.renter',
            'rental.rentalDetail',
          ],
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
          populate: [
            'rental',
            'rental.room',
            'rental.room.roomblock',
            'rental.landlord',
            'rental.renter',
            'rental.rentalDetail',
          ],
        },
      );
      return payment;
    } catch (error) {
      this.logger.error('Calling findById()', error, PaymentService.name);
      throw error;
    }
  }

  async findByIdAndRenterPopulate(id: number, renterId: number) {
    try {
      const payment = await this.em.findOne(
        Payment,
        {
          id: id,
          deleted_at: null,
          rental: { renter: { id: renterId } },
        },
        {
          populate: [
            'rental',
            'rental.room',
            'rental.room.roomblock',
            'rental.landlord',
            'rental.renter',
            'rental.rentalDetail',
          ],
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
      console.log(idLogined);
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
      const totalElectricPrice =
        paymentDTO.electricNumber * rental.rentalDetail.electricPrice;
      const totalWaterPrice =
        paymentDTO.waterNumber * rental.rentalDetail.waterPrice;
      const totalPrice =
        totalElectricPrice +
        totalWaterPrice +
        Number(rental.room.price) +
        paymentDTO.additionalPrice;
      const payment = {
        rental: rental,
        totalPrice: totalPrice,
        electricNumber: paymentDTO.electricNumber,
        totalElectricPrice: totalElectricPrice,
        waterNumber: paymentDTO.waterNumber,
        totalWaterPrice: totalWaterPrice,
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
      // Send notification
      await this.eventGateway.sendNotification(
        rental.renter.id,
        paymentDTO.month,
        paymentDTO.year,
        rentalDetailEntity.id,
      );
      // send mail inform
      const dto: NotificationDTO = {};
      dto.renter = plainToInstance(RenterInformationDTO, rental.renter);
      dto.payment = plainToInstance(PaymentInformationDTO, payment);
      dto.payment.roomPrice = payment.rental.room.price;
      dto.landlordName = rental.landlord.firstName;
      if (rental.landlord.lastName)
        dto.landlordName += ' ' + rental.landlord.lastName;
      this.notificationService.sendMail(dto, './notification');
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
      const paymentDb1 = await this.findByRentalIdMonthYear({
        rental_id: rental.id,
        additionalPrice: 0,
        electricNumber: 0,
        waterNumber: 0,
        month: paymentDTO.month,
        year: paymentDTO.year,
      });
      if (paymentDb1 && paymentDb1.id != paymentDb.id) {
        throw new BadRequestException('You are already create this payment');
      }
      if (!rental)
        throw new BadRequestException(
          'Can not found rental or you are not own this rental!',
        );
      const totalElectricPrice =
        paymentDTO.electricNumber * rental.rentalDetail.electricPrice;
      const totalWaterPrice =
        paymentDTO.waterNumber * rental.rentalDetail.waterPrice;
      const totalPrice =
        totalElectricPrice +
        totalWaterPrice +
        Number(rental.room.price) +
        paymentDTO.additionalPrice;
      paymentDb.additionalPrice = paymentDTO.additionalPrice;
      paymentDb.electricNumber = paymentDTO.electricNumber;
      paymentDb.month = paymentDTO.month;
      paymentDb.rental = rental;
      paymentDb.totalElectricPrice = totalElectricPrice;
      paymentDb.totalPrice = totalPrice;
      paymentDb.totalWaterPrice = totalWaterPrice;
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

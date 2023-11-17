import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PaymentStatus } from 'src/common/enum/common.enum';
import { User } from 'src/entities';
import { Payment } from 'src/entities/payment.entity';
import { NotificationDTO } from './dtos/notification.dto';
import { plainToInstance } from 'class-transformer';
import { RenterInformationDTO } from './dtos/renter-information.dto';
import { PaymentInformationDTO } from './dtos/payment-information.dto';
import { Notification } from 'src/entities/notification.entity';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(Payment)
    private readonly paymenyRepository: EntityRepository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Notification)
    private readonly notificationRepository: EntityRepository<Notification>,
    private readonly em: EntityManager,
    private readonly mailerService: MailerService,
  ) {}

  @Cron('0 0 6 * * *')
  async handleCron() {
    try {
      const paymentsUnpaid = await this.paymenyRepository.find(
        {
          status: PaymentStatus.UNPAID,
        },
        {
          populate: [
            'rental',
            'rental.renter',
            'rental.landlord',
            'rental.room',
          ],
        },
      );

      paymentsUnpaid.forEach(async (payment) => {
        const notification = await this.notificationRepository.findOne({
          renterId: payment.rental.renter.id,
          paymentId: payment.id,
        });

        if (!notification) {
          const renter = await this.userRepository.findOne({
            id: payment.rental.renter.id,
          });
          const landlord = await this.userRepository.findOne({
            id: payment.rental.landlord.id,
          });

          const dto: NotificationDTO = {};
          dto.renter = plainToInstance(RenterInformationDTO, renter);
          dto.payment = plainToInstance(PaymentInformationDTO, payment);
          dto.payment.roomPrice = payment.rental.room.price;
          dto.landlordName = landlord.firstName;
          if (landlord.lastName) dto.landlordName += ' ' + landlord.lastName;

          const newNotification = new Notification();
          newNotification.renterId = payment.rental.renter.id;
          newNotification.paymentId = payment.id;
          newNotification.message = JSON.stringify(dto);
          await this.em.persistAndFlush(newNotification);

          // send email
          this.sendMail(dto, './notification');
        } else {
          const message = JSON.parse(notification.message);
          // Check mail
          const sentMailDate = notification.created_at;
          const currentDate = new Date();
          const millisecondsInDay = 24 * 60 * 60 * 1000;
          const daysDifference = Math.floor(
            (currentDate.getTime() - sentMailDate.getTime()) /
              millisecondsInDay,
          );
          if (daysDifference % 3 === 0) {
            // send mail
            this.sendMail(message, './notification');
          }
        }
      });
    } catch (error) {
      this.logger.error(
        'Calling handleCron()',
        error,
        NotificationService.name,
      );
      throw error;
    }
  }

  async sendMail(notification: NotificationDTO, template: string) {
    try {
      await this.mailerService.sendMail({
        to: notification.renter.email,
        subject: 'Notification of room payment due date',
        template: template,
        context: {
          notification: notification,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

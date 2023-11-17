import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { UsersService } from '../users/users.service';
import { AWSService } from '../aws/aws.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, User } from 'src/entities';
import { Payment } from 'src/entities/payment.entity';
import { RentalService } from '../rental/rental.service';
import { RatingService } from '../rating/rating.service';
import { RentalDetail } from 'src/entities/rental_detail.entity';
import { Rental } from 'src/entities/rental.entity';
import { StripeController } from './stripe/stripe.controller';
import { TransactionService } from '../transaction/transaction.service';
import { NotificationModule } from '../notification/notification.module';
import { EventGateway } from '../notification/event.gateway';
import { MailerService } from '@nest-modules/mailer';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Payment]),
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([RentalDetail]),
    MikroOrmModule.forFeature([Rental]),
    NotificationModule,
  ],
  controllers: [PaymentController, StripeController],
  providers: [
    PaymentService,
    UsersService,
    AWSService,
    RentalService,
    RatingService,
    TransactionService,
    EventGateway,
  ],
})
export class PaymentModule {}

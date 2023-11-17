import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Payment } from 'src/entities/payment.entity';
import { User } from 'src/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Notification } from 'src/entities/notification.entity';
import { EventGateway } from './event.gateway';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MikroOrmModule.forFeature([Payment]),
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Notification]),
    UsersModule,
  ],
  controllers: [],
  providers: [NotificationService, EventGateway],
})
export class NotificationModule {}

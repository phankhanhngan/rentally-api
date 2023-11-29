import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { MikroOrmConfig, NestWinsternConfig } from './configs';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './modules/users/users.module';
import { AWSModule } from './modules/aws/aws.module';
import { ModRoomBlocksModule } from './modules/mod/roomblocks/roomblocks.module';
import { ModRoomsModule } from './modules/mod/rooms/room.module';
import { RoomsModule } from './modules/admin/rooms/rooms.module';
import { UtilitiesModule } from './modules/utilities/utilities.module';
import { RoomBlocksModule } from './modules/admin/roomblocks/roomblocks.module';
import { RatingModule } from './modules/rating/rating.module';
import { RentalModule } from './modules/rental/rental.module';
import { FindingModule } from './modules/finding/finding.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { ProvinceModule } from './modules/province/province.module';
import { PaymentModule } from './modules/payment/payment.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { NotificationModule } from './modules/notification/notification.module';
import { StripeService } from './modules/stripe/stripe.service';
@Module({
  imports: [
    MorganModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    MikroOrmModule.forRootAsync({
      useFactory: () => MikroOrmConfig(),
    }),
    WinstonModule.forRootAsync({
      useFactory: () => NestWinsternConfig(),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: process.env.MAIL_HOST,
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
        defaults: {
          from: `"No Reply " <${process.env.MAIL_FROM}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
    AuthModule,
    UsersModule,
    AWSModule,
    ModRoomBlocksModule,
    ModRoomsModule,
    RoomsModule,
    RoomBlocksModule,
    AWSModule,
    UtilitiesModule,
    RatingModule,
    RentalModule,
    FindingModule,
    ChecklistModule,
    ProvinceModule,
    PaymentModule,
    TransactionModule,
    NotificationModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    StripeService,
  ],
})
export class AppModule {}

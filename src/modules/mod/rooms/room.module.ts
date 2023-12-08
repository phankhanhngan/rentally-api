import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Room, RoomBlock, User } from 'src/entities';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AWSModule } from 'src/modules/aws/aws.module';
import { UsersModule } from 'src/modules/users/users.module';
import { ModRoomsController } from './room.controller';
import { UsersService } from 'src/modules/users/users.service';
import { ModRoomsService } from './room.service';
import { Utility } from 'src/entities/utility.entity';
import { StripeService } from 'src/modules/stripe/stripe.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    AWSModule,
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Utility]),
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([RoomBlock]),
  ],
  controllers: [ModRoomsController],
  providers: [ModRoomsService, UsersService, StripeService],
})
export class ModRoomsModule {}

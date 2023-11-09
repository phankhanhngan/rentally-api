import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { RatingService } from '../rating/rating.service';
import { RatingModule } from '../rating/rating.module';
import { UsersModule } from '../users/users.module';
import { ChecklistService } from './checklist.service';
import { UsersService } from '../users/users.service';
import { AWSModule } from '../aws/aws.module';
import { RentalModule } from '../rental/rental.module';
import { RentalService } from '../rental/rental.service';
import { MikroORM } from '@mikro-orm/mysql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities';

@Module({
  imports: [
    UsersModule,
    AWSModule,
    RatingModule,
    MikroOrmModule.forFeature([User]),
  ],
  controllers: [ChecklistController],
  providers: [ChecklistService, RatingService, RentalService, UsersService],
})
export class ChecklistModule {}

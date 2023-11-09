import { Module, forwardRef } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RentalService } from '../rental/rental.service';
import { RentalModule } from '../rental/rental.module';
import { RatingService } from './rating.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities';
import { AWSService } from '../aws/aws.service';

@Module({
  imports: [forwardRef(() => RentalModule), MikroOrmModule.forFeature([User])],
  providers: [RatingService, RentalService, UsersService, AWSService],
  controllers: [RatingController],
})
export class RatingModule {}

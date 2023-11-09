import { Module, forwardRef } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RatingService } from '../rating/rating.service';
import { RatingModule } from '../rating/rating.module';
import { RentalService } from './rental.service';
@Module({
  providers: [RentalService, RatingService],
  controllers: [RentalController],
  imports: [forwardRef(() => RatingModule)],
})
export class RentalModule {}

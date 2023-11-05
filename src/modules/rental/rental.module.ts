import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';

@Module({
  providers: [RentalService],
  controllers: [RentalController]
})
export class RentalModule {}

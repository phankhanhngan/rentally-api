import { Module } from '@nestjs/common';
import { ModRentalService } from './mod-rental.service';
import { ModRentalController } from './mod-rental.controller';

@Module({
  providers: [ModRentalService],
  controllers: [ModRentalController]
})
export class ModRentalModule {}

import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { UserRentalModule } from './user-rental/user-rental.module';
import { ModRentalModule } from './mod-rental/mod-rental.module';
@Module({
  providers: [RentalService],
  controllers: [RentalController],
  imports: [UserRentalModule, ModRentalModule],
})
export class RentalModule {}

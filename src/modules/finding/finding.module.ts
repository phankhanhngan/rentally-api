import { Module } from '@nestjs/common';
import { FindingService } from './finding.service';
import { FindingController } from './finding.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room, RoomBlock } from 'src/entities';

@Module({
  imports: [
    MikroOrmModule.forFeature([Room]),
    MikroOrmModule.forFeature([RoomBlock]),
  ],
  providers: [FindingService],
  controllers: [FindingController],
})
export class FindingModule {}

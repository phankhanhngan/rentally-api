import { Module } from '@nestjs/common';
import { AWSService } from './aws.service';

@Module({
  controllers: [],
  providers: [AWSService],
  exports: [AWSService],
})
export class AWSModule {}

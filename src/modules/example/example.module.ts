import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

@Module({
  imports: [MikroOrmModule.forFeature([])],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}

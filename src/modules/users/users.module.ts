import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities';
import { UsersService } from './users.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      User
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}

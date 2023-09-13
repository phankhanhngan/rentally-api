import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { MikroOrmConfig, NestWinsternConfig } from './configs';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ExampleModule } from './modules/example/example.module';

@Module({
  imports: [
    MorganModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    MikroOrmModule.forRootAsync({
      useFactory: () => MikroOrmConfig(),
    }),
    WinstonModule.forRootAsync({
      useFactory: () => NestWinsternConfig(),
    }),
    ExampleModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
  ],
})
export class AppModule {}

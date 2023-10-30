import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');

  const configService = app.get(ConfigService);

  const corsOrigin =
    configService.get<string>('LOCAL_MODE') === 'true'
      ? '*'
      : configService.get<string>('CLIENT_URL');

  app.enableCors({
    origin: corsOrigin,
  });
  // app.enableCors({
  //   origin: [
  //     'http://localhost:3000',
  //     'http://example.com',
  //     'http://www.example.com',
  //     'http://app.example.com',
  //     'https://example.com',
  //     'https://www.example.com',
  //     'https://app.example.com',
  //   ],
  //   methods: ["GET", "POST"],
  //   credentials: true,
  // });
  const port = configService.get<number>('PORT') || 3003;

  await app.listen(port, '0.0.0.0', () => {
    console.log(`App is running on port ${port}...`);
  });
}
bootstrap();

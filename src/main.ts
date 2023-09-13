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
  const port = configService.get<number>('APP_PORT') || 3003;

  await app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
  });
}
bootstrap();

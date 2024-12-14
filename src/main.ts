import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { APP_CONFIG } from './config/app.config';

async function bootstrap() {
  const logger = new Logger('Gantabya');
  logger.log(APP_CONFIG.banner);;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  })
  await app.listen(process.env.PORT ?? 3000, () => {
    logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  });
}
bootstrap();

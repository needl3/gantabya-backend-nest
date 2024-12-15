import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { APP_CONFIG } from './config/app.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Gantabya');
  logger.log(APP_CONFIG.banner);;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000, () => {
    logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  });
}
bootstrap();

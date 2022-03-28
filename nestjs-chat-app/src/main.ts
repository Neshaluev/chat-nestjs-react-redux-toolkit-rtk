import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AuthIoAdapter } from './chat/adapters/auth.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors();

  app.useWebSocketAdapter(new AuthIoAdapter(app));

  await app.listen(9000);
}
bootstrap();

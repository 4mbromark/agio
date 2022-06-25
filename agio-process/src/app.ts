import { NestFactory } from '@nestjs/core';
import { appendFile } from 'fs';
import { AgioProcessModule } from './app.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(AgioProcessModule);
}

bootstrap();

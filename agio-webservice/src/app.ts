import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AgioWebserviceModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AgioWebserviceModule);
  app.setGlobalPrefix(process.env.AGIO_WEBSERVICE_PREFIX);
  app.useGlobalPipes(new ValidationPipe({
    errorHttpStatusCode: HttpStatus.BAD_REQUEST
  }));
  app.enableCors();
  await app.listen(process.env.AGIO_WEBSERVICE_PORT);
}
bootstrap();

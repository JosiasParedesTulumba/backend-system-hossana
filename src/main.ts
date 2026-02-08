import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.setGlobalPrefix('api');
  app.enableCors();

  app.enableCors(); // comunicación con Angular

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,      // 👈 activa @Type()
      // whitelist: true,      // 👈 elimina campos que no están en el DTO
      // forbidNonWhitelisted: true, // 👈 error si mandan campos extra
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

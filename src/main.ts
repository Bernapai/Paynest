import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.use('/webhook/stripe', bodyParser.raw({ type: 'application/json' }));


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // lanza error si se envían propiedades no permitidas
      transform: true, // convierte automáticamente tipos (ej: string a number)
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Paynest API')
    .setDescription('API para la gestión de pagos y usuarios de Paynest.')
    .setVersion('1.0')
    .addTag('payments', 'Operaciones relacionadas a pagos')
    .addTag('users', 'Operaciones relacionadas a usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();

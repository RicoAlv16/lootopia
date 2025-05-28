import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { HttpExceptionFilter } from './shared/exception-filter/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('lootopia/api/v1');

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use('/static', express.static(join(__dirname, '..', 'public')));

  app.use(cookieParser());

  const options = new DocumentBuilder()
    .setTitle('Lootopia')
    .setDescription('Documentation API Lootopia')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Lootopia')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(
    `🚀 Application is running on: http://localhost:${port}/lootopia/api/v1`,
  );
  console.log(
    `📚 Swagger docs available on: http://localhost:${port}/lootopia/api/v1/doc`,
  );
  console.log(
    `🖼 Static assets served from: http://localhost:${port}/static/artefacts/{image.png}`,
  );
}
bootstrap();
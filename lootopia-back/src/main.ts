import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { HttpExceptionFilter } from './shared/exception-filter/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global pour vos routes API
  app.setGlobalPrefix('lootopia/api/v1');

  // Configuration des limites pour la gestion des payloads JSON
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Ajout d'une validation stricte avec ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforme les types en objets DTO
      whitelist: true, // Supprime les propriétés non déclarées
      forbidNonWhitelisted: true, // Bloque les requêtes contenant des propriétés inconnues
    }),
  );

  // Filtre global pour uniformiser les erreurs
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuration de CORS (vous pouvez ajuster ces paramètres selon vos besoins)
  app.enableCors({
    origin: process.env.FRONTEND_URL || process.env.AUTH0_AUDIENCE, // Restreignez au domaine de votre frontend si possible
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuration de Swagger
  const options = new DocumentBuilder()
    .setTitle('Lootopia')
    .setDescription('Documentation API Lootopia')
    .setVersion('1.0')
    .addBearerAuth() // Ajoute un champ pour le token dans Swagger
    .addTag('Lootopia')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  // Utiliser les cookie pour stocker les reponses api
  app.use(cookieParser());

  // Lancement de l'application
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(
    `🚀 Application is running on: http://localhost:${port}/lootopia/api/v1`,
  );
  console.log(
    `📚 Swagger docs available on: http://localhost:${port}/lootopia/api/v1/doc`,
  );
}
bootstrap();

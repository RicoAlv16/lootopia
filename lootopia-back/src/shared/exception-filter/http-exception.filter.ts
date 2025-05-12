import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Récupérez et transformez `getResponse()` en un objet toujours valide
    const rawResponse = exception.getResponse();

    // Transformez en un objet valide s'il ne l'est pas déjà
    const responseBody: Record<string, any> =
      typeof rawResponse === 'object' && rawResponse !== null
        ? (rawResponse as Record<string, any>) // TypeScript sait maintenant que c'est un objet
        : { message: rawResponse }; // Sinon, encapsulez dans un objet

    // Ajoutez des champs supplémentaires
    const responseError = {
      ...responseBody,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Envoyez la réponse JSON
    response.status(status).json(responseError);
  }
}

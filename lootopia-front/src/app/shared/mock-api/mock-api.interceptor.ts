import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  LoginRequestInterface,
  LoginResponseInterface,
} from '../../routes/auth/login/login.interface';

@Injectable({ providedIn: 'root' })
export class MockApiInterceptor {
  private mockUsers: LoginResponseInterface[] = [
    { email: 'admin@admin.com', token: 'token123' },
    { email: 'user1@user.com', token: 'token456' },
    { email: 'user2@user.com', token: 'token789' },
  ];

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> {
    if (req.url.endsWith('/auth/login') && req.method === 'POST') {
      const { email } = req.body as LoginRequestInterface;

      const user = this.mockUsers.find(u => u.email === email);
      if (user) {
        return of(new HttpResponse({ status: 200, body: user })).pipe(
          delay(500)
        ); // simulate delay
      } else {
        return of(
          new HttpResponse({
            status: 401,
            body: { error: 'Invalid credentials' },
          })
        ).pipe(delay(500));
      }
    }

    // Si ce n'est pas géré, passer au vrai serveur
    return next(req);
  }
}

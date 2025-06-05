import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../env/env.dev';
import { Observable } from 'rxjs';
import {
  LoginRequestInterface,
  LoginResponseInterface,
} from './login.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private backend = new environment();
  private http = inject(HttpClient);
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  login(loginPost: { codeOPT: number }): Observable<LoginResponseInterface> {
    return this.http.post<LoginResponseInterface>(
      this.backend.apiUrl + '/auth/login',
      loginPost,
      this.httpOptions
    );
  }

  verifyCredentials(userData: LoginRequestInterface): Observable<boolean> {
    return this.http.post<boolean>(
      this.backend.apiUrl + '/auth/verify-credentials',
      userData,
      this.httpOptions
    );
  }
}

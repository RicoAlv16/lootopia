import { Injectable } from '@angular/core';
import {
  LoginRequestInterface,
  LoginResponseInterface,
} from './login.interface';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = '/auth/login';

  constructor(private http: HttpClient) {}

  public login(
    email: string,
    password: string
  ): Observable<LoginResponseInterface> {
    const loginData: LoginRequestInterface = { email, password };
    return this.http.post<LoginResponseInterface>(this.apiUrl, loginData);
  }

  loginResource = httpResource<LoginRequestInterface>({
    method: 'POST',
    url: '/auth/login',
  });
}

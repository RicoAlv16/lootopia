import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/env.dev';

import {
  SiginRequestInterface,
  SiginResponsInterface,
  VerifyTokenRequest,
} from './sigin.interface';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SiginService {
  private backend = new environment();
  private http = inject(HttpClient);
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const passwordValid =
        hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  sigin(siginPost: SiginRequestInterface): Observable<SiginResponsInterface> {
    return this.http.post<SiginResponsInterface>(
      this.backend.apiUrl + '/users/sigin',
      siginPost,
      this.httpOptions
    );
  }

  verifyAccount(tokenData: VerifyTokenRequest): Observable<boolean> {
    return this.http.post<boolean>(
      this.backend.apiUrl + '/users/user-by-token',
      tokenData,
      this.httpOptions
    );
  }
}

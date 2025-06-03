import { Injectable } from '@angular/core';
import { LoginResponseInterface } from '../../../routes/auth/login/login.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'user';

  setUser(user: LoginResponseInterface): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  getUser(): LoginResponseInterface | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getUserId(): number | null {
    return this.getUser()?.id ?? null;
  }

  getToken(): string | null {
    return this.getUser()?.access_token ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
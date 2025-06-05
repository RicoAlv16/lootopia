import { inject, Injectable } from '@angular/core';
import { ProfilesInterface } from './profiles.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env/env.dev';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private http = inject(HttpClient);
  private backend = new environment();
  private apiUrl = this.backend.apiUrl + '/profiles';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  geProfile(email: string): Observable<ProfilesInterface> {
    return this.http.post<ProfilesInterface>(
      this.apiUrl + '/my-profile',
      { email },
      this.httpOptions
    );
  }
}

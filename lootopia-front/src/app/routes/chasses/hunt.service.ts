import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatedHunt, HuntForm } from './chasses.interface';
import { environment } from '../../../env/env.dev';

@Injectable({
  providedIn: 'root',
})
export class HuntService {
  private http = inject(HttpClient);
  private backend = new environment();
  private apiUrl = this.backend.apiUrl + '/hunts';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  createHunt(huntData: HuntForm, email: string): Observable<CreatedHunt> {
    return this.http.post<CreatedHunt>(
      this.apiUrl + '/create-hunt',
      { ...huntData, email },
      this.httpOptions
    );
  }

  getMyHunts(email: string): Observable<CreatedHunt[]> {
    return this.http.post<CreatedHunt[]>(
      this.apiUrl + '/my-hunts',
      { email },
      this.httpOptions
    );
  }

  getHunt(id: string, email: string): Observable<CreatedHunt> {
    return this.http.post<CreatedHunt>(`${this.apiUrl}/find`, { id, email });
  }

  updateHunt(
    id: string,
    huntData: Partial<HuntForm>,
    email: string
  ): Observable<CreatedHunt> {
    return this.http.post<CreatedHunt>(`${this.apiUrl}/update`, {
      id,
      ...huntData,
      email,
    });
  }

  deleteHunt(id: string, email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete`, { id, email });
  }

  publishHunt(id: string, email: string): Observable<CreatedHunt> {
    return this.http.post<CreatedHunt>(
      this.apiUrl + '/publish-hunt',
      { id, email },
      this.httpOptions
    );
  }
}

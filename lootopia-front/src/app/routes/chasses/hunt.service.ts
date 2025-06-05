/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatedHunt, HuntForm } from './chasses.interface';
import { environment } from '../../../env/env.dev';
import { ActiveHunt } from '../chasses-aux-tresors/chasses-actives.interface';

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
    return this.http.post<CreatedHunt>(`${this.apiUrl}/update-hunt`, {
      id,
      email,
      updateData: huntData, // ✅ Encapsuler les données dans updateData
    });
  }

  deleteHunt(id: string, email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete-hunt`, { id, email });
  }

  publishHunt(id: string, email: string): Observable<CreatedHunt> {
    return this.http.post<CreatedHunt>(
      this.apiUrl + '/publish-hunt',
      { id, email },
      this.httpOptions
    );
  }

  getActiveHunts(): Observable<ActiveHunt[]> {
    return this.http.get<ActiveHunt[]>(
      `${this.apiUrl}/active-hunts`,
      this.httpOptions
    );
  }

  // Méthodes de participation aux chasses
  joinHunt(huntId: string, email: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/join`,
      { email, huntId },
      this.httpOptions
    );
  }

  leaveHunt(huntId: string, email: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/leave`,
      { email, huntId },
      this.httpOptions
    );
  }

  getMyParticipations(email: string): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.apiUrl}/my-participations`,
      { email },
      this.httpOptions
    );
  }
}

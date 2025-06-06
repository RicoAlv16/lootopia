import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArtefactService {
  constructor(private http: HttpClient) {}

  getMyArtefacts(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/lootopia/api/v1/artefacts/my`);
  }

  getAllMyArtefacts(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/lootopia/api/v1/artefacts/my/all`);
  }
}
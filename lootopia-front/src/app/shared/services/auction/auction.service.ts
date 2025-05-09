import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuctionService {
  private baseUrl = 'http://localhost:3000/auction'; // adapte l'URL selon ton backend

  constructor(private http: HttpClient) {}

  getAuction(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  placeBid(auctionId: number, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/bid`, { auctionId, amount });
  }

  createAuction(data: {
    artefactId: number;
    startingPrice: number;
    durationInMinutes: number;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }
}

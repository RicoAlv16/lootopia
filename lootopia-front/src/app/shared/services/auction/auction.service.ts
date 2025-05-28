import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuctionService {
  private baseUrl = 'http://localhost:3000/lootopia/api/v1/auction';

  constructor(private http: HttpClient) {}

  getAuction(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getAllAuctions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/list`);
  }

  getMyAuctions(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my?userId=${userId}`);
  }

  getFollowedAuctions(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/followed?userId=${userId}`);
  }

  placeBid(auctionId: number, amount: number): Observable<any> {
    const userId = 2; // en pratique, à récupérer depuis auth service
    return this.http.post(`${this.baseUrl}/bid`, { auctionId, amount, userId });
  }

  createAuction(data: {
    artefactId: number;
    startingPrice: number;
    durationInMinutes: number;
    userId: number;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }
}
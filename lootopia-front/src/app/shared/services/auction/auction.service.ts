import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuctionService {
  private baseUrl = 'http://localhost:3000/lootopia/api/v1/auction';
  private followBaseUrl = 'http://localhost:3000/lootopia/api/v1/follow-auction';

  constructor(private http: HttpClient) {}

  getAuction(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getAllAuctions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/list`);
  }

  getMyAuctions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my`);
  }

  getFollowedAuctions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.followBaseUrl}/followed`);
  }

  createAuction(data: {
    artefactId: number;
    startingPrice: number;
    durationInMinutes: number;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  placeBid(auctionId: number, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/bid`, { auctionId, amount });
  }

  followAuction(auctionId: number): Observable<void> {
    return this.http.post<void>(`${this.followBaseUrl}/follow`, { auctionId });
  }

  unfollowAuction(auctionId: number): Observable<void> {
    return this.http.delete<void>(`${this.followBaseUrl}/unfollow?auctionId=${auctionId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuctionService {
  private baseUrl = 'http://localhost:3000/lootopia/api/v1/auction';
  private followBaseUrl = 'http://localhost:3000/lootopia/api/v1/follow-auction';

  constructor(private http: HttpClient) {}

  // Obtenir une enchère par ID
  getAuction(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Liste complète des enchères
  getAllAuctions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/list`);
  }

  // Mes enchères
  getMyAuctions(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my?userId=${userId}`);
  }

  // Enchères suivies
  getFollowedAuctions(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.followBaseUrl}/followed?userId=${userId}`);
  }

  // Créer une enchère
  createAuction(data: {
    artefactId: number;
    startingPrice: number;
    durationInMinutes: number;
    userId: number;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  // Placer une enchère
  placeBid(auctionId: number, amount: number): Observable<any> {
    const userId = 1; // TODO: Remplacer par un auth service réel
    return this.http.post(`${this.baseUrl}/bid`, { auctionId, amount, userId });
  }

  // Suivre une enchère
  followAuction(userId: number, auctionId: number): Observable<void> {
    return this.http.post<void>(`${this.followBaseUrl}/follow`, {
      userId,
      auctionId,
    });
  }

  // Ne plus suivre une enchère
  unfollowAuction(userId: number, auctionId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.followBaseUrl}/unfollow?userId=${userId}&auctionId=${auctionId}`
    );
  }
}

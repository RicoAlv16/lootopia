import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuctionService {
  private baseUrl = 'http://localhost:3000/auction'; // adapte l'URL si tu as un préfixe

  constructor(private http: HttpClient) {}

  getAuction(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // getAllAuctions(): Observable<any[]> {
  //   return this.http.get<any[]>(this.baseUrl);
  // }

  getAllAuctions(): Observable<any[]> {
    return of([
  {
    id: 1,
    currentBid: 150,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    artefact: { name: 'Épée du destin', rarity: 'Épique' }
  },
  {
    id: 2,
    currentBid: 80,
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    artefact: { name: 'Bague ancienne', rarity: 'Rare' }
  },
  {
    id: 3,
    currentBid: 40,
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
    artefact: { name: 'Pierre de feu', rarity: 'Commun' }
  },
  {
    id: 4,
    currentBid: 300,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    artefact: { name: 'Cape d’invisibilité', rarity: 'Légendaire' }
  },
  // 20 artefacts supplémentaires mockés :
  {
    id: 5, currentBid: 70, endTime: new Date(Date.now() + 3e6), artefact: { name: 'Anneau runique', rarity: 'Rare' }
  },
  {
    id: 6, currentBid: 220, endTime: new Date(Date.now() + 9e6), artefact: { name: 'Grimoire ancien', rarity: 'Épique' }
  },
  {
    id: 7, currentBid: 15, endTime: new Date(Date.now() + 1.5e6), artefact: { name: 'Talisman usé', rarity: 'Commun' }
  },
  {
    id: 8, currentBid: 410, endTime: new Date(Date.now() + 12e6), artefact: { name: 'Sceptre du roi', rarity: 'Légendaire' }
  },
  {
    id: 9, currentBid: 90, endTime: new Date(Date.now() + 4e6), artefact: { name: 'Hache de guerre', rarity: 'Rare' }
  },
  {
    id: 10, currentBid: 33, endTime: new Date(Date.now() + 1e6), artefact: { name: 'Bracelet de cuir', rarity: 'Commun' }
  },
  {
    id: 11, currentBid: 600, endTime: new Date(Date.now() + 15e6), artefact: { name: 'Armure sacrée', rarity: 'Légendaire' }
  },
  {
    id: 12, currentBid: 180, endTime: new Date(Date.now() + 5e6), artefact: { name: 'Fiole magique', rarity: 'Épique' }
  },
  {
    id: 13, currentBid: 105, endTime: new Date(Date.now() + 2.3e6), artefact: { name: 'Orbe de lumière', rarity: 'Rare' }
  },
  {
    id: 14, currentBid: 25, endTime: new Date(Date.now() + 0.8e6), artefact: { name: 'Charme cassé', rarity: 'Commun' }
  },
  {
    id: 15, currentBid: 450, endTime: new Date(Date.now() + 13e6), artefact: { name: 'Diadème royal', rarity: 'Légendaire' }
  },
  {
    id: 16, currentBid: 135, endTime: new Date(Date.now() + 3.3e6), artefact: { name: 'Lame du vent', rarity: 'Épique' }
  },
  {
    id: 17, currentBid: 95, endTime: new Date(Date.now() + 2.5e6), artefact: { name: 'Pendentif ancien', rarity: 'Rare' }
  },
  {
    id: 18, currentBid: 10, endTime: new Date(Date.now() + 0.5e6), artefact: { name: 'Coquille enchantée', rarity: 'Commun' }
  },
  {
    id: 19, currentBid: 520, endTime: new Date(Date.now() + 10e6), artefact: { name: 'Trident de Poséidon', rarity: 'Légendaire' }
  },
  {
    id: 20, currentBid: 170, endTime: new Date(Date.now() + 6.5e6), artefact: { name: 'Cape de l’ombre', rarity: 'Épique' }
  },
  {
    id: 21, currentBid: 50, endTime: new Date(Date.now() + 2.1e6), artefact: { name: 'Clochette ancienne', rarity: 'Rare' }
  },
  {
    id: 22, currentBid: 35, endTime: new Date(Date.now() + 1.2e6), artefact: { name: 'Bourse de cuir', rarity: 'Commun' }
  },
  {
    id: 23, currentBid: 390, endTime: new Date(Date.now() + 8.3e6), artefact: { name: 'Anneau d’invocation', rarity: 'Légendaire' }
  },
  {
    id: 24, currentBid: 200, endTime: new Date(Date.now() + 7e6), artefact: { name: 'Tome interdit', rarity: 'Épique' }
  }
]);

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
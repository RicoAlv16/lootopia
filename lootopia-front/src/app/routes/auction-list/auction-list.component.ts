import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuctionService } from '../../shared/services/auction/auction.service';
import { AuctionDetailComponent } from '../auction/auction-detail.component';
import { CreateAuctionComponent } from '../create-auction/create-auction.component';

@Component({
  selector: 'app-auction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AuctionDetailComponent, CreateAuctionComponent],
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.css']
})
export class AuctionListComponent {
  private auctionService = inject(AuctionService);

  auctions: any[] = [];
  filteredAuctions: any[] = [];

  searchName = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  rarity: string = '';

  rarities = ['Commun', 'Rare', 'Épique', 'Légendaire'];

  tabs = [
    { key: 'all' as const, label: 'Toutes' },
    { key: 'mine' as const, label: 'Mes enchères' },
    { key: 'followed' as const, label: 'Suivies' }
  ];
  activeTab: 'all' | 'mine' | 'followed' = 'all';

  selectedAuction: any = null;

ngOnInit(): void {
  const userId = 2; // à remplacer avec userService ou authService si nécessaire

  this.auctionService.getAllAuctions().subscribe({
    next: (allAuctions) => {
      this.auctionService.getFollowedAuctions(userId).subscribe({
        next: (followedAuctions) => {
          const followedIds = new Set(followedAuctions.map(a => a.id));
          
          this.auctions = allAuctions.map(a => ({
            ...a,
            isFollowed: followedIds.has(a.id),
            isMine: a.seller?.id === userId // si nécessaire pour le tab "mine"
          }));

          this.filter();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des enchères suivies', err);
          this.auctions = allAuctions;
          this.filter();
        }
      });
    },
    error: (err) => {
      console.error('Erreur lors du chargement des enchères', err);
    }
  });
}


  setTab(tab: 'all' | 'mine' | 'followed'): void {
    this.activeTab = tab;
    this.filter();
  }

  filter(): void {
    this.filteredAuctions = this.auctions.filter(a => {
      const nameMatch = a.artefact.loot.name.toLowerCase().includes(this.searchName.toLowerCase());
      const priceMatch = (!this.priceMin || a.currentBid >= this.priceMin) &&
                        (!this.priceMax || a.currentBid <= this.priceMax);
      const rarityMatch = !this.rarity || a.artefact.loot.rarity === this.rarity;

      const tabMatch =
        this.activeTab === 'all' ||
        (this.activeTab === 'mine' && a.isMine) ||
        (this.activeTab === 'followed' && a.isFollowed);

      return nameMatch && priceMatch && rarityMatch && tabMatch;
    });
  }


  openAuctionDetail(auction: any): void {
    this.selectedAuction = auction;
  }

  closeAuctionDetail(): void {
    this.selectedAuction = null;
  }

  refreshAuctions(): void {
    const userId = 2;
    this.auctionService.getAllAuctions().subscribe({
      next: (allAuctions) => {
        this.auctionService.getFollowedAuctions(userId).subscribe({
          next: (followedAuctions) => {
            const followedIds = new Set(followedAuctions.map(a => a.id));

            this.auctions = allAuctions.map(a => ({
              ...a,
              isFollowed: followedIds.has(a.id),
              isMine: a.seller?.id === userId
            }));

            this.filter();
          },
          error: () => {
            this.auctions = allAuctions;
            this.filter();
          }
        });
      },
      error: (err) => console.error('Erreur refresh', err)
    });
  }

  showCreateForm = false;

  openCreateAuction(): void {
    this.showCreateForm = true;
  }

  closeCreateAuction(): void {
    this.showCreateForm = false;
    this.refreshAuctions(); // Pour recharger les données après création
  }
}
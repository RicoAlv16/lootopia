import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuctionService } from '../../shared/services/auction/auction.service';
import { AuctionDetailComponent } from '../auction/auction-detail.component';
import { CreateAuctionComponent } from '../create-auction/create-auction.component';
import { ToastService } from '../../shared/services/toast/toast.service';

@Component({
  selector: 'app-auction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AuctionDetailComponent, CreateAuctionComponent],
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.css']
})
export class AuctionListComponent {
  private auctionService = inject(AuctionService);
  private toastService = inject(ToastService);

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
  showCreateForm = false;

  ngOnInit(): void {
    this.loadAuctionsByTab();
  }

  setTab(tab: 'all' | 'mine' | 'followed'): void {
    this.activeTab = tab;
    this.loadAuctionsByTab();
  }

  loadAuctionsByTab(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    if (!userId) {
      this.toastService.showServerError('Utilisateur non connecté');
      return;
    }

    if (this.activeTab === 'mine') {
      this.auctionService.getMyAuctions().subscribe({
        next: (mine) => {
          this.auctions = mine.map(a => ({ ...a, isMine: true }));
          this.filter();
        },
        error: () => this.toastService.showServerError('Erreur chargement mes enchères')
      });
    } else if (this.activeTab === 'followed') {
      this.auctionService.getFollowedAuctions().subscribe({
        next: (followed) => {
          this.auctions = followed.map(a => ({ ...a, isFollowed: true }));
          this.filter();
        },
        error: () => this.toastService.showServerError('Erreur chargement enchères suivies')
      });
    } else {
      this.auctionService.getAllAuctions().subscribe({
        next: (all) => {
          this.auctionService.getFollowedAuctions().subscribe({
            next: (followed) => {
              const followedIds = new Set(followed.map(a => a.id));
              this.auctions = all.map(a => ({
                ...a,
                isMine: a.seller?.id === userId,
                isFollowed: followedIds.has(a.id),
              }));
              this.filter();
            },
            error: () => {
              this.toastService.showServerError('Erreur chargement des suivis');
              this.auctions = all;
              this.filter();
            }
          });
        },
        error: () => this.toastService.showServerError('Erreur chargement enchères')
      });
    }
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
    this.loadAuctionsByTab();
  }

  openCreateAuction(): void {
    this.showCreateForm = true;
  }

  closeCreateAuction(): void {
    this.showCreateForm = false;
    this.refreshAuctions(); // Recharge les données après création
  }
}
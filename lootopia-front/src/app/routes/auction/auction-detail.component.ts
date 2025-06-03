import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuctionService } from '../../shared/services/auction/auction.service';
import { AuthService } from '../../shared/services/auth/auth.services';

@Component({
  selector: 'app-auction-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.css']
})
export class AuctionDetailComponent implements OnInit, OnDestroy {
  @Input() auction: any;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  bidAmount: number = 0;
  countdown: string = '';
  intervalId: any;
  endTimeFormatted: string = '';
  isFollowed: boolean = false;
  userId: number | null = null;

  private auctionService = inject(AuctionService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      alert("Utilisateur non authentifié.");
      return;
    }

    this.updateBidAmount();
    this.formatEndDate();
    this.startCountdown();
    this.checkIfFollowed();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  updateBidAmount(): void {
    if (this.auction) {
      this.bidAmount = this.auction.currentBid + 1;
    }
  }

  formatEndDate(): void {
    const endDate = new Date(this.auction.endTime);
    this.endTimeFormatted = endDate.toLocaleString('fr-FR');
  }

  startCountdown(): void {
    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(this.auction.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        this.countdown = 'Terminé';
        clearInterval(this.intervalId);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.countdown = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  placeBid(): void {
    if (!this.userId) {
      alert("Utilisateur non authentifié.");
      return;
    }

    this.auctionService.placeBid(this.auction.id, this.bidAmount).subscribe({
      next: () => {
        this.updated.emit();
        this.close.emit();
      },
      error: err => alert("Erreur d'enchère : " + err.message)
    });
  }

  closeDetail(): void {
    this.close.emit();
  }

  toggleFollow(): void {
    if (!this.userId) {
      alert("Utilisateur non authentifié.");
      return;
    }

    const observable = this.isFollowed
      ? this.auctionService.unfollowAuction(this.auction.id)
      : this.auctionService.followAuction(this.auction.id);

    observable.subscribe(() => {
      this.isFollowed = !this.isFollowed;
      this.updated.emit();
    });
  }

  checkIfFollowed(): void {
    if (!this.userId) return;

    this.auctionService.getFollowedAuctions().subscribe((followed) => {
      this.isFollowed = followed.some((a: any) => a.id === this.auction.id);
    });
  }
}

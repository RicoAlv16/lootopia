import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuctionService } from '../../shared/services/auction/auction.service';

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
  @Output() updated = new EventEmitter<void>(); // 🔥 nouveau

  bidAmount: number = 0;
  countdown: string = '';
  intervalId: any;
  endTimeFormatted: string = '';
  isFollowed: boolean = false;

  constructor(private auctionService: AuctionService) {}

  ngOnInit(): void {
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
    const userId = 2; // à remplacer
    this.auctionService.placeBid(this.auction.id, this.bidAmount).subscribe({
      next: () => {
        this.updated.emit(); // 🔥 informer le parent
        this.close.emit();   // optionnel si tu veux fermer après
      },
      error: err => alert("Erreur d'enchère : " + err.message)
    });
  }

  closeDetail(): void {
    this.close.emit();
  }

  toggleFollow(): void {
    const userId = 2;
    const observable = this.isFollowed
      ? this.auctionService.unfollowAuction(userId, this.auction.id)
      : this.auctionService.followAuction(userId, this.auction.id);

    observable.subscribe(() => {
      this.isFollowed = !this.isFollowed;
      this.updated.emit(); // 🔥 informer le parent
    });
  }

  checkIfFollowed(): void {
    const userId = 2;
    this.auctionService.getFollowedAuctions(userId).subscribe((followed) => {
      this.isFollowed = followed.some((a: any) => a.id === this.auction.id);
    });
  }
}

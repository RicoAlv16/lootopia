import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
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

  bidAmount: number = 0;
  countdown: string = '';
  intervalId: any;
  endTimeFormatted: string = '';

  constructor(private auctionService: AuctionService) {}

  ngOnInit(): void {
    this.updateBidAmount();
    this.formatEndDate();
    this.startCountdown();
  }

  ngOnChanges(): void {
    this.updateBidAmount();
    this.formatEndDate();
    this.startCountdown();
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
    console.log("📤 Envoi d'enchère", this.bidAmount);

    const userId = 2; // À remplacer avec authentification réelle
    this.auctionService.placeBid(this.auction.id, this.bidAmount).subscribe({
      next: (res) => {
        console.log('✅ Enchère réussie', res);
        alert('Enchère placée avec succès !');
        this.close.emit();
      },
      error: (err) => {
        console.error('❌ Erreur enchère', err);
        alert(err?.error?.message || 'Erreur lors de l’enchère');
      }
    });
  }

  closeDetail(): void {
    this.close.emit();
  }
}
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auction-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.css']
})
export class AuctionDetailComponent {
  @Input() auction: any;
  @Output() close = new EventEmitter<void>();

  bidAmount: number = 0;

  ngOnChanges(): void {
    if (this.auction) {
      this.bidAmount = this.auction.currentBid + 1;
    }
  }

  placeBid(): void {
    alert(`Tu veux enchérir ${this.bidAmount} sur l’enchère #${this.auction.id}`);
    this.close.emit(); // fermeture après enchère fictive
  }

  closeDetail(): void {
    this.close.emit();
  }
}
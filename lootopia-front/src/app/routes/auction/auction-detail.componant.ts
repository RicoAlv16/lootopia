import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '../../shared/services/auction/auction.service';

@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss']
})
export class AuctionDetailComponent implements OnInit {
  auction: any;
  bidAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.auctionService.getAuction(id).subscribe((data) => {
      this.auction = data;
      this.bidAmount = data.currentBid + 1;
    });
  }

  placeBid(): void {
    this.auctionService.placeBid(this.auction.id, this.bidAmount).subscribe({
      next: () => {
        alert('Enchère réussie !');
        this.ngOnInit();
      },
      error: (err) => alert(err.error?.message || 'Erreur lors de l’enchère'),
    });
  }
}

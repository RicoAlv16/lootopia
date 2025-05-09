import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../../shared/services/auction/auction.service';
import { ArtefactService } from '../../shared/services/auction/artefact.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.scss'],
})
export class CreateAuctionComponent implements OnInit {
  artefacts: any[] = [];
  selectedArtefactId: number | null = null;
  startingPrice: number = 0;
  durationInMinutes: number = 60;

  constructor(
    private auctionService: AuctionService,
    private artefactService: ArtefactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.artefactService.getMyArtefacts().subscribe((data) => {
      this.artefacts = data;
    });
  }

  createAuction(): void {
    if (!this.selectedArtefactId || this.startingPrice <= 0) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    this.auctionService
      .createAuction({
        artefactId: this.selectedArtefactId,
        startingPrice: this.startingPrice,
        durationInMinutes: this.durationInMinutes,
      })
      .subscribe({
        next: () => {
          alert('Enchère créée avec succès !');
          this.router.navigate(['/']); // à adapter selon ta navigation
        },
        error: (err) => alert(err.error?.message || 'Erreur'),
      });
  }
}

import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { AuctionService } from '../../shared/services/auction/auction.service';
import { ArtefactService } from '../../shared/services/auction/artefact.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../shared/services/toast/toast.service'; // ← importe ton service

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.css'],
})
export class CreateAuctionComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  artefacts: any[] = [];
  selectedArtefactId: number | null = null;
  selectedArtefact: any = null;
  startingPrice = 0;
  durationInMinutes = 60;

  userId: number | null = null;

  // ✅ Injection du service toast
  private toastService = inject(ToastService);

  constructor(
    private auctionService: AuctionService,
    private artefactService: ArtefactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user?.id;

    if (!this.userId) {
      this.toastService.showServerError("Utilisateur non authentifié.");
      return;
    }

    this.artefactService.getMyArtefacts().subscribe({
      next: (data) => {
        this.artefacts = data;
      },
      error: (err) => {
        console.error('Erreur chargement artefacts', err);
        this.toastService.showServerError("Erreur lors du chargement des artefacts.");
      },
    });
  }

  onArtefactChange(): void {
    this.selectedArtefact = this.artefacts.find(a => a.id === this.selectedArtefactId) || null;
  }

  createAuction(): void {
    if (!this.selectedArtefactId || this.startingPrice <= 0 || !this.userId) {
      this.toastService.showServerError("Veuillez remplir tous les champs.");
      return;
    }

    this.auctionService.createAuction({
      artefactId: this.selectedArtefactId,
      startingPrice: this.startingPrice,
      durationInMinutes: this.durationInMinutes,
    }).subscribe({
      next: () => {
        this.toastService.showSuccess("Enchère créée avec succès !");
        this.close.emit();
      },
      error: (err) => {
        const message = err.error?.message || "Erreur lors de la création de l'enchère.";
        this.toastService.showServerError(message);
      },
    });
  }

  cancel(): void {
    this.close.emit();
  }
}
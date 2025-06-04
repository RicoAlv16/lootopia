import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArtefactService } from '../../shared/services/auction/artefact.service';
import { ToastService } from '../../shared/services/toast/toast.service';

@Component({
  selector: 'app-user-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-inventory.component.html',
  styleUrls: ['./user-inventory.component.css']
})
export class UserInventoryComponent implements OnInit {
  private artefactService = inject(ArtefactService);
  private toastService = inject(ToastService);

  artefacts: any[] = [];
  filteredArtefacts: any[] = [];

  searchName = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  rarity: string = '';

  rarities = ['Commun', 'Rare', 'Épique', 'Légendaire'];

  ngOnInit(): void {
    this.loadArtefacts();
  }

  loadArtefacts(): void {
    this.artefactService.getMyArtefacts().subscribe({
      next: (data) => {
        this.artefacts = data;
        this.filter();
      },
      error: () => {
        this.toastService.showServerError("Erreur lors du chargement de l'inventaire");
      }
    });
  }

  filter(): void {
    this.filteredArtefacts = this.artefacts.filter(a => {
      const nameMatch = a.loot.name.toLowerCase().includes(this.searchName.toLowerCase());
      const price = a.estimatedPrice || 0;
      const priceMatch = (!this.priceMin || price >= this.priceMin) &&
                         (!this.priceMax || price <= this.priceMax);
      const rarityMatch = !this.rarity || a.loot.rarity === this.rarity;

      return nameMatch && priceMatch && rarityMatch;
    });
  }
}
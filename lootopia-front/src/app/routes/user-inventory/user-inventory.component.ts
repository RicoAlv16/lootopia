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

  searchQuery = '';
  rarityFilter = '';
  sortOrder: 'recent' | 'oldest' = 'recent';

  rarities = ['Commun', 'Rare', 'Épique', 'Légendaire'];

  ngOnInit(): void {
    this.loadArtefacts();
  }

  loadArtefacts(): void {
    this.artefactService.getAllMyArtefacts().subscribe({
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
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredArtefacts = this.artefacts
      .filter(a => {
        const nameMatch = a.loot.name.toLowerCase().includes(query);
        const date = new Date(a.obtainedAt);
        const dateStr = date.toLocaleDateString('fr-FR');
        const isoDate = date.toISOString().split('T')[0];
        const dateMatch = dateStr.includes(query) || isoDate.includes(query);

        const rarityMatch = !this.rarityFilter || a.loot.rarity === this.rarityFilter;

        return (nameMatch || dateMatch) && rarityMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.obtainedAt).getTime();
        const dateB = new Date(b.obtainedAt).getTime();
        return this.sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
      });
  }
}

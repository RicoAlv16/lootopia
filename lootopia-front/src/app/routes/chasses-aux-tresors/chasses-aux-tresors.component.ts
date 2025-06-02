import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../shared/services/toast/toast.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HuntService } from '../chasses/hunt.service';
import { ActiveHunt } from './chasses-actives.interface';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MapPoint } from '../../shared/services/map/map.service';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-chasses-aux-tresors',
  imports: [
    CommonModule,
    Toast,
    CardModule,
    DialogModule,
    ButtonModule,
    MapComponent,
  ],
  standalone: true,
  providers: [MessageService, ToastService],
  templateUrl: './chasses-aux-tresors.component.html',
  styleUrl: './chasses-aux-tresors.component.css',
})
export class ChassesAuxTresorsComponent implements OnInit {
  activeHunts = signal<ActiveHunt[]>([]);
  isLoading = signal(false);

  // Modals state
  showDetailsModal = false;
  showParticipateModal = false;
  selectedHunt = signal<ActiveHunt | null>(null);

  user!: {
    email: string;
    access_token: string;
  };
  email = '';

  private huntService = inject(HuntService);
  private toastService = inject(ToastService);

  ngOnInit() {
    const userStr = localStorage.getItem('user') || '{}';
    this.user = JSON.parse(userStr);
    this.email = this.user.email;

    this.loadActiveHunts();
  }

  private loadActiveHunts() {
    this.isLoading.set(true);
    this.huntService.getActiveHunts().subscribe({
      next: hunts => {
        this.activeHunts.set(hunts);
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Erreur lors du chargement des chasses actives:', error);
        this.toastService.showServerError(
          'Erreur lors du chargement des chasses actives'
        );
        this.isLoading.set(false);
      },
    });
  }

  getWorldTypeLabel(worldType: string): string {
    return worldType === 'real' ? 'Monde Réel' : 'Monde Cartographique';
  }

  getDurationLabel(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
    return `${minutes} min`;
  }

  getRewardLabel(rewards: {
    first: number;
    second: number;
    third: number;
  }): string {
    const total = rewards.first + rewards.second + rewards.third;
    return total > 0 ? `${total}€ de récompenses` : 'Aucune récompense';
  }

  joinHunt(huntId: string) {
    const hunt = this.activeHunts().find(h => h.id === huntId);
    if (hunt) {
      this.selectedHunt.set(hunt);
      this.showParticipateModal = true;
    }
  }

  viewDetails(huntId: string) {
    const hunt = this.activeHunts().find(h => h.id === huntId);
    if (hunt) {
      this.selectedHunt.set(hunt);
      this.showDetailsModal = true;
    }
  }

  closeParticipateModal() {
    this.showParticipateModal = false;
    this.selectedHunt.set(null);
  }

  confirmParticipation() {
    if (this.selectedHunt()) {
      this.huntService.joinHunt(this.selectedHunt()!.id, this.email).subscribe({
        next: () => {
          this.toastService.showSuccess(
            `Vous participez maintenant à "${this.selectedHunt()!.title}"`
          );
          this.showParticipateModal = false;
          this.selectedHunt.set(null);
        },
        error: error => {
          this.toastService.showServerError(error.error.message || '');
        },
      });
    }
  }

  getHuntStepsAsMapPoints(hunt: ActiveHunt): MapPoint[] {
    return hunt.steps.map((step, index) => ({
      lat: step.latitude || 48.8566, // Coordonnées par défaut si non définies
      lng: step.longitude || 2.3522,
      title: `Étape ${index + 1}: ${step.title}`,
      description: step.description,
    }));
  }

  getHuntCenter(hunt: ActiveHunt): MapPoint {
    if (hunt.steps.length === 0) {
      return { lat: 48.8566, lng: 2.3522 }; // Paris par défaut
    }

    // Calculer le centre des étapes
    const avgLat =
      hunt.steps.reduce((sum, step) => sum + (step.latitude || 48.8566), 0) /
      hunt.steps.length;
    const avgLng =
      hunt.steps.reduce((sum, step) => sum + (step.longitude || 2.3522), 0) /
      hunt.steps.length;

    return { lat: avgLat, lng: avgLng };
  }
}

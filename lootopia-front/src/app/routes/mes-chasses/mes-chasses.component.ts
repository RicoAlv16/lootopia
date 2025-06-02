import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HuntService } from '../chasses/hunt.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { CarouselModule } from 'primeng/carousel';

interface MyHuntParticipation {
  id: string;
  status: 'active' | 'completed' | 'abandoned';
  joinedAt: string;
  completedAt?: string;
  score: number;
  hunt: {
    id: string;
    title: string;
    description: string;
    duration: number;
    worldType: string;
    mode: string;
    status: string;
    user: {
      nickname: string;
    };
  };
}

@Component({
  selector: 'app-mes-chasses',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToastModule,
    CarouselModule,
  ],
  standalone: true,
  providers: [MessageService, ToastService],
  templateUrl: './mes-chasses.component.html',
  styleUrl: './mes-chasses.component.css',
})
export class MesChassesComponent implements OnInit {
  participations = signal<MyHuntParticipation[]>([]);
  isLoading = signal(false);
  user!: {
    email: string;
    access_token: string;
  };
  email = '';

  constructor(
    private huntService: HuntService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user') || '{}';
    this.user = JSON.parse(userStr);
    this.email = this.user.email;
    this.loadMyParticipations();
  }

  loadMyParticipations() {
    this.isLoading.set(true);

    this.huntService.getMyParticipations(this.email).subscribe({
      next: data => {
        this.participations.set(data);
        this.isLoading.set(false);
      },
      error: error => {
        this.toastService.showServerError(error.error.message || '');
        this.isLoading.set(false);
      },
    });
  }

  leaveHunt(huntId: string) {
    this.isLoading.set(true);

    this.huntService.leaveHunt(huntId, this.email).subscribe({
      next: () => {
        this.toastService.showSuccess('Vous avez quitté la chasse avec succès');
        this.loadMyParticipations(); // Recharger la liste
      },
      error: error => {
        this.toastService.showServerError(error.error.message || '');
        this.isLoading.set(false);
      },
    });
  }

  continueHunt(huntId: string) {
    // Navigation vers la chasse active
    // TODO: Implémenter la navigation
    console.log('Continuer la chasse:', huntId);
  }

  getStatusLabel(status: string): string {
    const labels = {
      active: 'En cours',
      completed: 'Terminée',
      abandoned: 'Abandonnée',
    };
    return labels[status as keyof typeof labels] || status;
  }

  getStatusSeverity(status: string): string {
    const severities = {
      active: 'info',
      completed: 'success',
      abandoned: 'warning',
    };
    return severities[status as keyof typeof severities] || 'info';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { TimelineModule } from 'primeng/timeline';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  Artifact,
  Activity,
  ActiveHunt,
  DashboardService,
  DashboardData,
  Badge,
} from './dashboard.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboad',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    ChartModule,
    GalleriaModule,
    CarouselModule,
    DialogModule,
    TimelineModule,
    ProgressBarModule,
    TagModule,
    ToastModule,
    InputSwitchModule,
    DropdownModule,
    TooltipModule,
    FormsModule,
  ],
  providers: [MessageService],
  templateUrl: './dashboad.component.html',
  styleUrls: ['./dashboad.component.css'],
})
export class DashboadComponent implements OnInit {
  // Stats rapides
  completedHunts = 0;
  huntsGoal = 100;
  artifactsCount = 0;
  totalArtifacts = 150;
  artifacts: Artifact[] = [];
  ranking = 'Débutant';
  // crownss = 0;
  crowns = signal<number>(0);

  // Récupérer l'utilisateur
  user!: {
    nickname: string;
    email: string;
    access_token: string;
  };
  nickname = '';
  email = '';
  access_token = '';

  // Activité récente
  recentActivities: Activity[] = [];

  // Artefacts
  artifactsList: Artifact[] = [];
  selectedArtifactFilters = {
    rarity: 'all',
    type: 'all',
    date: 'all',
  };

  // Chasses en cours
  activeHunts: ActiveHunt[] = [];

  // Badges
  badges: Badge[] = [];

  // État de chargement
  loading = true;
  error: string | null = null;

  private route = inject(ActivatedRoute);

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user') || '{}';
    this.user = JSON.parse(userStr);
    this.nickname = this.user.nickname;
    this.email = this.user.email;
    this.access_token = this.user.access_token;

    this.loadDashboardData();
    this.progressionData = this.getDefaultProgressionData();
    this.setupChartOptions();
  }

  private loadDashboardData() {
    this.loading = true;
    this.error = null;

    this.dashboardService.getDashboardData(this.email).subscribe({
      next: (data: DashboardData) => {
        this.updateComponentData(data);
        this.loading = false;

        // Ajouter les couronnes du localStorage si elles existent
        const couronnes = localStorage.getItem('crowsPaid');
        const payment = this.route.snapshot.paramMap.get('payment');
        if (couronnes && payment === 'payment-success') {
          const additionalCrowns = parseInt(couronnes);
          this.crowns.set(this.crowns() + additionalCrowns);
        }
      },
      error: error => {
        console.error(
          'Erreur lors du chargement des données du dashboard:',
          error
        );
        this.error = 'Erreur lors du chargement des données';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les données du dashboard',
        });
      },
    });
  }

  private updateComponentData(data: DashboardData) {
    this.completedHunts = data.completedHunts;
    this.huntsGoal = data.huntsGoal;
    this.artifactsCount = data.artifactsCount;
    this.totalArtifacts = data.totalArtifacts;
    this.ranking = data.ranking;
    this.crowns.set(data.crowns);
    this.recentActivities = data.recentActivities || [];
    this.progressionData =
      data.progressionData || this.getDefaultProgressionData();
    this.artifactsList = data.artifactsList || [];
    this.activeHunts = data.activeHunts || [];
    this.badges = data.badges || [];

    this.setupChartOptions();
  }

  // Changez les déclarations de propriétés
  progressionData: any;
  progressionOptions: any;

  // Modifiez la méthode getDefaultProgressionData
  private getDefaultProgressionData(): any {
    return {
      labels: ['Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov'],
      datasets: [
        {
          label: 'Niveau',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: '#8B5CF6',
          borderColor: '#8B5CF6',
          borderWidth: 2,
        },
        {
          label: 'Chasses',
          data: [28, 48, 40, 19, 86, 27],
          backgroundColor: '#06D6A0',
          borderColor: '#06D6A0',
          borderWidth: 2,
        },
        {
          label: 'Couronnes',
          data: [12, 25, 30, 45, 32, 18],
          backgroundColor: '#FFD60A',
          borderColor: '#FFD60A',
          borderWidth: 2,
        },
      ],
    };
  }

  // Modifiez setupChartOptions
  private setupChartOptions() {
    this.progressionOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#6EE7B7',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#9CA3AF',
            font: {
              weight: 500,
            },
          },
          grid: {
            color: '#374151',
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: '#9CA3AF',
          },
          grid: {
            color: '#374151',
            drawBorder: false,
          },
        },
      },
      elements: {
        bar: {
          backgroundColor: ['#8B5CF6', '#06D6A0', '#FFD60A'],
          borderColor: ['#8B5CF6', '#06D6A0', '#FFD60A'],
          borderWidth: 1,
        },
      },
    };
  }

  incrementCompletedHunts() {
    this.dashboardService.incrementCompletedHunts().subscribe({
      next: () => {
        this.completedHunts += 1;
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Chasse complétée !',
        });
      },
      error: error => {
        console.error("Erreur lors de l'incrémentation des chasses:", error);
      },
    });
  }

  addArtifact(artifact: Artifact) {
    this.dashboardService.addArtifact(artifact).subscribe({
      next: () => {
        this.artifactsList.push(artifact);
        this.artifactsCount = this.artifactsList.length;
        this.messageService.add({
          severity: 'success',
          summary: 'Nouvel artefact !',
          detail: `${artifact.name} ajouté à votre collection`,
        });
      },
      error: error => {
        console.error("Erreur lors de l'ajout de l'artefact:", error);
      },
    });
  }

  addRecentActivity(activity: Activity) {
    this.dashboardService.addRecentActivity(activity).subscribe({
      next: () => {
        this.recentActivities.unshift(activity);
        if (this.recentActivities.length > 10) {
          this.recentActivities = this.recentActivities.slice(0, 10);
        }
      },
      error: error => {
        console.error("Erreur lors de l'ajout de l'activité:", error);
      },
    });
  }

  // Méthodes utilitaires
  formatTimeLeft(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  // Méthode pour rafraîchir les données
  refreshData() {
    this.loadDashboardData();
  }

  // Méthode pour réinitialiser les données (utile pour les tests)
  resetDashboardData() {
    const defaultData = {
      completedHunts: 0,
      huntsGoal: 100,
      artifactsCount: 0,
      totalArtifacts: 150,
      ranking: 'Débutant',
      crowns: 0,
      recentActivities: [],
      progressionData: this.getDefaultProgressionData(),
      artifactsList: [],
      activeHunts: [],
      badges: [],
    };

    this.dashboardService.updateDashboardData(defaultData).subscribe({
      next: () => {
        this.loadDashboardData();
        this.messageService.add({
          severity: 'info',
          summary: 'Réinitialisé',
          detail: 'Données du dashboard réinitialisées',
        });
      },
      error: error => {
        console.error('Erreur lors de la réinitialisation:', error);
      },
    });
  }
}

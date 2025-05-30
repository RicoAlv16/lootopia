import { Component, OnInit } from '@angular/core';
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

interface Activity {
  date: Date;
  hunt: string;
  reward: string;
  status: string;
  isNew: boolean;
}

interface Artifact {
  id: number;
  name: string;
  rarity: string;
  type: string;
  image: string;
  isNew: boolean;
}

interface ActiveHunt {
  name: string;
  progress: number;
  timeLeft: number;
  location: string;
}

interface Badge {
  name: string;
  icon: string;
  category: 'explorer' | 'collector' | 'social';
  description: string;
  unlocked: boolean;
}

// Ajouter ces interfaces en haut du fichier avec les autres interfaces
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
}

interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      labels?: {
        color?: string;
      };
    };
    title?: {
      display?: boolean;
      text?: string;
      color?: string;
    };
  };
  scales?: {
    x?: {
      ticks?: {
        color?: string;
      };
      grid?: {
        color?: string;
      };
    };
    y?: {
      ticks?: {
        color?: string;
      };
      grid?: {
        color?: string;
      };
    };
  };
}

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
  templateUrl: './dashboad.component.html',
  styleUrls: ['./dashboad.component.css'],
})
export class DashboadComponent implements OnInit {
  // Stats rapides
  completedHunts = 42;
  huntsGoal = 100;
  artifactsCount = 27; // Nouveau compteur pour le nombre total d'artefacts
  totalArtifacts = 150;
  artifacts: Artifact[] = []; // Modifié pour être un tableau d'Artifact
  ranking = 'Top 10';
  crowns = 1500;

  // Activité récente
  recentActivities: Activity[] = [];

  // Données du graphique de progression
  // Remplacer les 'any' par les nouveaux types
  progressionData: ChartData = {
    labels: [],
    datasets: [],
  };
  progressionOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#495057',
        },
      },
    },
  };

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

  // constructor() {}

  ngOnInit() {
    this.initializeData();
    this.setupCharts();
  }

  private initializeData() {
    // Initialisation des données mockées
    this.initActivities();
    this.initArtifacts();
    this.initActiveHunts();
    this.initBadges();
  }

  private setupCharts() {
    this.progressionData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Niveau',
          data: [1, 2, 3, 4, 5, 6],
          fill: false,
          borderColor: '#4CAF50', // Changé en vert
          tension: 0.4,
        },
        {
          label: 'Chasses',
          data: [10, 15, 8, 12, 9, 14],
          fill: false,
          borderColor: '#81C784', // Vert plus clair
          tension: 0.4,
        },
        {
          label: 'Couronnes',
          data: [100, 150, 80, 120, 90, 140],
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4,
        },
      ],
    };

    this.progressionOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#6EE7B7',
          },
        },
      },
    };
  }

  // Méthodes d'initialisation des données mockées
  private initActivities() {
    this.recentActivities = [
      {
        date: new Date(),
        hunt: 'Chasse au trésor',
        reward: '100 couronnes',
        status: 'Terminé',
        isNew: true,
      },
      // Ajouter plus d'activités...
    ];
  }

  private initArtifacts() {
    this.artifactsList = [
      {
        id: 1,
        name: 'Épée légendaire',
        rarity: 'Légendaire',
        type: 'Arme',
        image: 'assets/sword.png',
        isNew: true,
      },
      // Ajouter plus d'artefacts...
    ];
  }

  private initActiveHunts() {
    this.activeHunts = [
      {
        name: 'Chasse mystérieuse',
        progress: 65,
        timeLeft: 3600,
        location: 'Forêt enchantée',
      },
      // Ajouter plus de chasses...
    ];
  }

  private initBadges() {
    this.badges = [
      {
        name: 'Explorateur novice',
        icon: '🗺️',
        category: 'explorer',
        description: 'Complétez 5 chasses',
        unlocked: true,
      },
      // Ajouter plus de badges...
    ];
  }

  // Méthodes utilitaires
  formatTimeLeft(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env/env.dev';

// Interfaces pour les données du dashboard
export interface Activity {
  date: Date;
  hunt: string;
  reward: string;
  status: string;
  isNew: boolean;
}

export interface Artifact {
  id: number;
  name: string;
  rarity: string;
  type: string;
  image: string;
  isNew: boolean;
}

export interface ActiveHunt {
  name: string;
  progress: number;
  timeLeft: number;
  location: string;
}

export interface Badge {
  name: string;
  icon: string;
  category: 'explorer' | 'collector' | 'social';
  description: string;
  unlocked: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
    tension?: number;
  }[];
}

export interface DashboardData {
  id: number;
  completedHunts: number;
  huntsGoal: number;
  artifactsCount: number;
  totalArtifacts: number;
  ranking: string;
  crowns: number;
  recentActivities: Activity[];
  progressionData: ChartData;
  artifactsList: Artifact[];
  activeHunts: ActiveHunt[];
  badges: Badge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateDashboardData {
  completedHunts?: number;
  huntsGoal?: number;
  artifactsCount?: number;
  totalArtifacts?: number;
  ranking?: string;
  crowns?: number;
  recentActivities?: Activity[];
  progressionData?: ChartData;
  artifactsList?: Artifact[];
  activeHunts?: ActiveHunt[];
  badges?: Badge[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private backend = new environment();
  private apiUrl = this.backend.apiUrl + '/dashboard';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  // Récupérer les données du dashboard
  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl);
  }

  // Mettre à jour les données du dashboard
  updateDashboardData(data: UpdateDashboardData): Observable<DashboardData> {
    return this.http.put<DashboardData>(this.apiUrl, data, this.httpOptions);
  }

  // Incrémenter le nombre de chasses complétées
  incrementCompletedHunts(): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/increment-hunts`,
      {},
      this.httpOptions
    );
  }

  // Ajouter des couronnes
  addCrowns(amount: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/add-crowns`,
      { amount },
      this.httpOptions
    );
  }

  // Ajouter un artefact
  addArtifact(artifact: Artifact): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/add-artifact`,
      artifact,
      this.httpOptions
    );
  }

  // Ajouter une activité récente
  addRecentActivity(activity: Activity): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/add-activity`,
      activity,
      this.httpOptions
    );
  }
}

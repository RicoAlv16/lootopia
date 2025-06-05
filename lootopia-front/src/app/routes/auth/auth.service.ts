import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    // Vérifier l'état d'authentification au démarrage
    this.checkAuthStatus();
  }

  /**
   * Vérifie si l'utilisateur a un token valide
   */
  private hasValidToken(): boolean {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return false;

      const user = JSON.parse(userStr);
      return !!(user && user.access_token);
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return false;
    }
  }

  /**
   * Vérifie le statut d'authentification
   */
  checkAuthStatus(): void {
    const isAuth = this.hasValidToken();
    this.isAuthenticatedSubject.next(isAuth);
  }

  /**
   * Retourne true si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCurrentUser(): any {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  }

  /**
   * Récupère le token d'accès
   */
  getAccessToken(): string | null {
    const user = this.getCurrentUser();
    return user ? user.access_token : null;
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('createdHunts');
    localStorage.removeItem('crowsPaid');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/home']);
  }

  /**
   * Met à jour le statut d'authentification après connexion
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAuthenticated(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.isAuthenticatedSubject.next(true);
  }
}

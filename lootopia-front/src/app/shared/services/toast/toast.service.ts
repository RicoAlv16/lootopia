import { MessageService } from 'primeng/api';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'success',
      detail: message || 'Bien jouer! Votre enrégistrement est bien effectué.',
    });
  }

  showServerError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail:
        message ||
        'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.',
    });
  }

  showInvalidTap() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Vos saisis sont vides ou invalides',
    });
  }

  showInvalidCred(error: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error,
    });
  }
}

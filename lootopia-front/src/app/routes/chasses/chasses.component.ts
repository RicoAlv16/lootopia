import { Component, inject, OnInit, signal } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';
import { CreatedHunt, HuntForm, HuntRewards } from './chasses.interface';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../shared/services/toast/toast.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { HuntService } from './hunt.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-chasses',
  imports: [
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
    TextareaModule,
    SelectButtonModule,
    Toast,
    ModalComponent,
    CardModule,
  ],
  standalone: true,
  providers: [MessageService, ToastService],
  templateUrl: './chasses.component.html',
  styleUrl: './chasses.component.css',
})
export class ChassesComponent implements OnInit {
  // Propriétés pour le formulaire de chasse
  huntForm: HuntForm = {
    title: '',
    description: '',
    duration: 60,
    worldType: 'real',
    mode: 'public',
    maxParticipants: 10,
    participationFee: 0,
    chatEnabled: true,
    interactiveMap: false,
    mapConfig: {
      name: '',
      skin: 'standard',
      zone: '',
      scale: 1,
    },
    steps: [],
    landmarks: [],
    rewards: {
      first: 0,
      second: 0,
      third: 0,
    },
    searchDelay: 5,
    searchCost: 0,
  };

  // Options pour les dropdowns
  worldTypeOptions = [
    { label: 'Monde Réel', value: 'real' },
    { label: 'Monde Cartographique', value: 'cartographic' },
  ];

  modeOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Privé', value: 'private' },
  ];

  mapSkinOptions = [
    { label: 'Standard', value: 'standard' },
    { label: 'Satellite', value: 'satellite' },
    { label: 'Terrain', value: 'terrain' },
    { label: 'Hybride', value: 'hybrid' },
  ];

  validationTypeOptions = [
    { label: 'Découverte de la Cache', value: 'cache_discovery' },
    { label: "Saisie d'une passphrase", value: 'passphrase' },
    { label: "Passage en revue d'un Repère", value: 'landmark_review' },
  ];

  visibleCreateHunt = false;
  isCreateHuntModal = false;
  createdHunts = signal<CreatedHunt[]>([]);
  user!: {
    email: string;
    access_token: string;
  };
  email = '';
  editingHuntId: string | null = null;

  private toastService = inject(ToastService);
  private huntService = inject(HuntService);
  public isLoading = signal(false);

  ngOnInit() {
    const userStr = localStorage.getItem('user') || '{}';
    this.user = JSON.parse(userStr);
    this.email = this.user.email;
    // Initialiser avec une étape par défaut
    if (this.huntForm.steps.length === 0) {
      this.addStep();
    }
    this.loadHuntsFromAPI();

    // Charger les chasses existantes
    this.loadHuntsFromStorage();
  }

  // Méthodes pour la gestion des étapes
  addStep() {
    this.huntForm.steps.push({
      riddle: '',
      validationType: 'cache_discovery',
      answer: '',
      hasMap: false,
    });
  }

  removeStep(index: number) {
    if (this.huntForm.steps.length > 1) {
      this.huntForm.steps.splice(index, 1);
    } else {
      this.toastService.showServerError(
        'Une chasse doit avoir au moins une étape'
      );
    }
  }

  // Méthodes pour la gestion des repères
  addLandmark() {
    this.huntForm.landmarks.push({
      name: '',
      latitude: 0,
      longitude: 0,
      description: '',
    });
  }

  removeLandmark(index: number) {
    this.huntForm.landmarks.splice(index, 1);
  }

  // Validation du formulaire
  validateHuntForm(): boolean {
    if (!this.huntForm.title.trim()) {
      this.toastService.showServerError('Le titre est obligatoire');
      return false;
    }

    if (!this.huntForm.description.trim()) {
      this.toastService.showServerError('La description est obligatoire');
      return false;
    }

    if (this.huntForm.duration < 15) {
      this.toastService.showServerError('La durée minimum est de 15 minutes');
      return false;
    }

    if (this.huntForm.steps.length === 0) {
      this.toastService.showServerError('Au moins une étape est requise');
      return false;
    }

    // Vérifier que toutes les étapes sont complètes
    for (let i = 0; i < this.huntForm.steps.length; i++) {
      const step = this.huntForm.steps[i];
      if (!step.riddle.trim() || !step.answer.trim()) {
        this.toastService.showServerError(`L'étape ${i + 1} est incomplète`);
        return false;
      }
    }

    // Vérifier la configuration de la carte si activée
    if (this.huntForm.interactiveMap) {
      if (
        !this.huntForm.mapConfig.name.trim() ||
        !this.huntForm.mapConfig.zone.trim()
      ) {
        this.toastService.showServerError(
          'La configuration de la carte est incomplète'
        );
        return false;
      }
    }

    return true;
  }

  // Sauvegarder comme brouillon
  saveDraft() {
    // Validation minimale pour le brouillon
    if (!this.huntForm.title.trim()) {
      this.toastService.showServerError(
        'Le titre est obligatoire même pour un brouillon'
      );
      return;
    }

    // Sauvegarder en localStorage ou envoyer au serveur
    localStorage.setItem('huntDraft', JSON.stringify(this.huntForm));
    this.toastService.showSuccess('Brouillon sauvegardé avec succès');
  }

  openCreateHuntModal() {
    this.visibleCreateHunt = true;
    this.isCreateHuntModal = true;
  }

  // Charger les chasses depuis l'API
  private loadHuntsFromAPI() {
    this.isLoading.set(true);
    this.huntService.getMyHunts(this.email).subscribe({
      next: hunts => {
        this.createdHunts.set(hunts);
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Erreur lors du chargement des chasses:', error);
        this.toastService.showServerError(error.error.message || '');
        this.isLoading.set(false);
        // Fallback vers localStorage en cas d'erreur
        this.loadHuntsFromStorage();
      },
    });
  }

  // Créer la chasse via l'API
  // createHunt() {
  //   if (!this.validateHuntForm()) {
  //     return;
  //   }

  //   this.isLoading.set(true);

  //   this.huntService.createHunt(this.huntForm, this.email).subscribe({
  //     next: newHunt => {
  //       // Ajouter la chasse au signal de façon réactive
  //       this.createdHunts.update(hunts => [newHunt, ...hunts]);

  //       this.toastService.showSuccess('Chasse créée avec succès!');

  //       // Réinitialiser le formulaire
  //       this.resetHuntForm();

  //       // Fermer le modal
  //       this.visibleCreateHunt = false;
  //       this.isCreateHuntModal = false;

  //       this.isLoading.set(false);
  //     },
  //     error: error => {
  //       console.error('Erreur lors de la création de la chasse:', error);
  //       this.toastService.showServerError(
  //         'Erreur lors de la création de la chasse'
  //       );
  //       this.isLoading.set(false);

  //       // Fallback vers localStorage en cas d'erreur
  //       this.createHuntLocally();
  //     },
  //   });
  // }

  // Créer ou modifier une chasse

  // Générer un ID unique plus robuste

  // Créer ou modifier une chasse

  createHunt() {
    if (!this.huntForm.title || !this.huntForm.description) {
      this.toastService.showServerError(
        'Veuillez remplir tous les champs obligatoires'
      );
      return;
    }

    // Activer le loading
    this.isLoading.set(true);

    const huntData = {
      ...this.huntForm,
    };

    if (this.editingHuntId) {
      // Mode édition - mettre à jour la chasse existante
      this.huntService
        .updateHunt(this.editingHuntId, huntData, this.email)
        .subscribe({
          next: updatedHunt => {
            console.log('Chasse mise à jour avec succès:', updatedHunt);

            // Mettre à jour la chasse dans la liste
            this.createdHunts.update(hunts =>
              hunts.map(hunt =>
                hunt.id === this.editingHuntId ? updatedHunt : hunt
              )
            );

            this.toastService.showSuccess('Chasse modifiée avec succès!');

            // Fermer le modal et réinitialiser
            this.visibleCreateHunt = false;
            this.isCreateHuntModal = false;
            this.resetHuntForm();
            this.editingHuntId = null;
            this.isLoading.set(false);
          },
          error: error => {
            console.error('Erreur lors de la modification:', error);
            this.toastService.showServerError(
              'Erreur lors de la modification de la chasse'
            );
            this.isLoading.set(false);
          },
        });
    } else {
      // Mode création - créer une nouvelle chasse
      this.huntService.createHunt(huntData, this.email).subscribe({
        next: newHunt => {
          console.log('Chasse créée avec succès:', newHunt);
          this.createdHunts.update(hunts => [newHunt, ...hunts]);
          this.toastService.showSuccess('Chasse créée avec succès!');

          // Fermer le modal et réinitialiser
          this.visibleCreateHunt = false;
          this.isCreateHuntModal = false;
          this.resetHuntForm();
          this.isLoading.set(false);
        },
        error: error => {
          console.error('Erreur lors de la création:', error);
          this.toastService.showServerError(
            'Erreur lors de la création de la chasse'
          );
          this.isLoading.set(false);

          // Fallback vers localStorage en cas d'erreur
          this.createHuntLocally();
        },
      });
    }
  }

  private generateUniqueId(): string {
    // Utilise crypto.randomUUID() si disponible (moderne et sécurisé)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback pour les environnements plus anciens
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    const extraRandom = Math.random().toString(36).substring(2, 8);

    return `hunt_${timestamp}_${randomPart}_${extraRandom}`;
  }

  // Méthode de fallback pour créer localement
  private createHuntLocally() {
    const newHunt: CreatedHunt = {
      id: this.generateUniqueId(),
      user: 'local_user',
      ...this.huntForm,
      status: this.huntForm.mode === 'private' ? 'private' : 'draft',
      participants: 0,
      createdAt: new Date(),
    };

    this.createdHunts.update(hunts => [newHunt, ...hunts]);
    this.saveHuntsToStorage();

    this.toastService.showSuccess('Chasse créée localement (mode hors ligne)');
    this.resetHuntForm();
    this.visibleCreateHunt = false;
    this.isCreateHuntModal = false;
  }

  // Publier une chasse avec confirmation
  publishHunt(huntId: string) {
    // Afficher une confirmation avant publication
    if (
      confirm(
        'Êtes-vous sûr de vouloir publier cette chasse ? Une fois publiée, elle sera visible par tous les utilisateurs et sortira de votre liste de chasses en cours.'
      )
    ) {
      this.huntService.publishHunt(huntId, this.email).subscribe({
        next: updatedHunt => {
          console.log('Chasse publiée avec succès:', updatedHunt);
          // Retirer la chasse de la liste car elle devient active
          this.createdHunts.update(hunts =>
            hunts.filter(hunt => hunt.id !== huntId)
          );
          this.toastService.showSuccess(
            'Chasse publiée avec succès! Elle est maintenant visible par tous les utilisateurs.'
          );
        },
        error: error => {
          console.error('Erreur lors de la publication:', error);
          this.toastService.showServerError(
            'Erreur lors de la publication de la chasse'
          );
        },
      });
    }
  }

  // Supprimer une chasse
  deleteHunt(huntId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette chasse ?')) {
      this.huntService.deleteHunt(huntId, this.email).subscribe({
        next: () => {
          this.createdHunts.update(hunts =>
            hunts.filter(hunt => hunt.id !== huntId)
          );
          this.toastService.showSuccess('Chasse supprimée avec succès!');
        },
        error: error => {
          console.error('Erreur lors de la suppression:', error);
          this.toastService.showServerError(
            'Erreur lors de la suppression de la chasse'
          );
        },
      });
    }
  }

  // Getter pour l'état de chargement
  get loading() {
    return this.isLoading();
  }

  // Sauvegarder les chasses dans localStorage
  private saveHuntsToStorage() {
    localStorage.setItem('createdHunts', JSON.stringify(this.createdHunts()));
  }

  // Charger les chasses depuis localStorage
  private loadHuntsFromStorage() {
    const savedHunts = localStorage.getItem('createdHunts');
    if (savedHunts) {
      try {
        const hunts = JSON.parse(savedHunts);
        this.createdHunts.set(hunts);
      } catch (error) {
        console.error('Erreur lors du chargement des chasses:', error);
      }
    }
  }

  // Méthodes utilitaires pour le template
  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'draft':
        return 'Brouillon';
      case 'private':
        return 'Privée';
      case 'completed':
        return 'Terminée';
      default:
        return 'Inconnue';
    }
  }

  getWorldTypeLabel(worldType: string): string {
    return worldType === 'real' ? 'Monde Réel' : 'Monde Cartographique';
  }

  getDurationLabel(duration: number): string {
    if (duration === 0) return 'Illimitée';
    if (duration < 60) return `${duration} minutes`;
    if (duration < 1440) return `${Math.floor(duration / 60)} heures`;
    return `${Math.floor(duration / 1440)} jours`;
  }

  getRewardLabel(rewards: HuntRewards): string {
    const total = rewards.first + rewards.second + rewards.third;
    if (total === 0) return 'Aucune récompense';
    return `${total} Couronnes`;
  }

  // Réinitialiser le formulaire
  resetHuntForm() {
    this.editingHuntId = null; // Réinitialiser l'ID d'édition
    this.huntForm = {
      title: '',
      description: '',
      duration: 60,
      worldType: 'real',
      mode: 'public',
      maxParticipants: 10,
      participationFee: 0,
      chatEnabled: true,
      interactiveMap: false,
      mapConfig: {
        name: '',
        skin: 'standard',
        zone: '',
        scale: 1,
      },
      steps: [
        {
          riddle: '',
          validationType: 'cache_discovery',
          answer: '',
          hasMap: false,
        },
      ],
      landmarks: [],
      rewards: {
        first: 0,
        second: 0,
        third: 0,
      },
      searchDelay: 5,
      searchCost: 0,
    };
  }

  // Charger un brouillon
  loadDraft() {
    const draft = localStorage.getItem('huntDraft');
    if (draft) {
      try {
        this.huntForm = JSON.parse(draft);
        this.toastService.showSuccess('Brouillon chargé');
      } catch {
        this.toastService.showServerError(
          'Erreur lors du chargement du brouillon'
        );
      }
    }
  }

  // Éditer une chasse
  editHunt(hunt: CreatedHunt) {
    // Charger les données de la chasse dans le formulaire
    this.huntForm = {
      title: hunt.title,
      description: hunt.description,
      duration: hunt.duration,
      worldType: hunt.worldType,
      mode: hunt.mode,
      maxParticipants: hunt.maxParticipants,
      participationFee: hunt.participationFee,
      chatEnabled: hunt.chatEnabled,
      interactiveMap: hunt.interactiveMap,
      mapConfig: hunt.mapConfig,
      steps: hunt.steps,
      landmarks: hunt.landmarks,
      rewards: hunt.rewards,
      searchDelay: hunt.searchDelay || 5,
      searchCost: hunt.searchCost || 0,
    };

    // Stocker l'ID de la chasse en cours d'édition
    this.editingHuntId = hunt.id;

    // Ouvrir le modal de création/édition
    this.visibleCreateHunt = true;
    this.isCreateHuntModal = true;

    this.toastService.showSuccess('Chasse chargée pour modification');
  }

  // Getter pour le texte du bouton
  get createButtonText(): string {
    return this.editingHuntId ? 'Modifier la chasse' : 'Créer la chasse';
  }
}

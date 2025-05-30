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

  private toastService = inject(ToastService);

  ngOnInit() {
    const userStr = localStorage.getItem('user') || '{}';
    this.user = JSON.parse(userStr);
    this.email = this.user.email;
    // Initialiser avec une étape par défaut
    if (this.huntForm.steps.length === 0) {
      this.addStep();
    }

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

  // Créer la chasse
  createHunt() {
    if (!this.validateHuntForm()) {
      return;
    }

    // Créer une nouvelle chasse avec un ID unique
    const newHunt: CreatedHunt = {
      user: this.email,
      ...this.huntForm,
      status: this.huntForm.mode === 'private' ? 'private' : 'draft',
      participants: 0,
      createdAt: new Date(),
    };

    // Ajouter la chasse au signal de façon réactive
    this.createdHunts.update(hunts => [...hunts, newHunt]);

    // Sauvegarder dans localStorage pour la persistance
    this.saveHuntsToStorage();

    // Ici vous pouvez envoyer les données au serveur
    console.log('Création de la chasse:', this.huntForm);

    // Simuler la création
    this.toastService.showSuccess('Chasse créée avec succès!');

    // Réinitialiser le formulaire
    this.resetHuntForm();

    // Fermer le modal
    this.visibleCreateHunt = false;
    this.isCreateHuntModal = false;
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
}

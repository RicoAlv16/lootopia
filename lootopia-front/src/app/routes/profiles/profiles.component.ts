import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProfilesService } from './profiles.service';
import { ProfilesInterface } from './profiles.interface';
import { ToastService } from '../../shared/services/toast/toast.service';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputSwitchModule,
    DropdownModule,
    AvatarModule,
    TagModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css',
})
export class ProfilesComponent implements OnInit {
  private profilesService = inject(ProfilesService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  // Signaux pour la gestion d'état
  profile = signal<ProfilesInterface | null>(null);
  loading = signal(false);
  editMode = signal(false);

  // Options pour le type de compte
  compteOptions = [
    { label: 'Particulier', value: 'particulier' },
    { label: 'Partenaire', value: 'partenaire' },
  ];

  // Formulaire réactif
  profileForm: FormGroup;

  // Données utilisateur par défaut
  defaultAvatar =
    'https://cdnb.artstation.com/p/assets/images/images/014/542/275/large/mariel-clariz-rogero-yhel-original-defaultsize-copy.jpg?1544424133';

  user!: {
    nickname: string;
    email: string;
    access_token: string;
  };
  nickname = '';
  email = '';
  access_token = '';

  constructor() {
    this.profileForm = this.fb.group({
      compte: ['particulier', [Validators.required]],
      nickname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
      bio: ['', [Validators.maxLength(500)]],
      photo: [''],
      acceptMFA: [false],
      compteOff: [false],
    });
  }

  ngOnInit() {
    const userStr = localStorage.getItem('user') || '{}';
    this.user = JSON.parse(userStr);
    this.nickname = this.user.nickname;
    this.email = this.user.email;
    this.access_token = this.user.access_token;

    this.loadProfile();
    this.loadUserDataFromStorage();
  }

  loadUserDataFromStorage() {
    // Charger les données depuis le localStorage

    this.profileForm.patchValue({
      nickname: this.nickname,
      email: this.email,
    });
  }

  loadProfile() {
    this.loading.set(true);

    this.profilesService.geProfile(this.email).subscribe({
      next: profileData => {
        this.profile.set(profileData);
        this.profileForm.patchValue(profileData);
        this.loading.set(false);
      },
      error: error => {
        console.error('Erreur lors du chargement du profil:', error);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger le profil',
        });
      },
    });
  }

  toggleEditMode() {
    this.editMode.set(!this.editMode());
    if (!this.editMode()) {
      // Annuler les modifications
      this.profileForm.patchValue(this.profile() || {});
      this.loadUserDataFromStorage();
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.loading.set(true);
      const updatedProfile = this.profileForm.value;

      // Sauvegarder dans le localStorage
      localStorage.setItem('nickname', updatedProfile.nickname);
      localStorage.setItem('userEmail', updatedProfile.email);

      // Simulation de sauvegarde (à remplacer par un vrai appel API)
      setTimeout(() => {
        this.profile.set(updatedProfile);
        this.editMode.set(false);
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Profil mis à jour avec succès',
        });
      }, 1000);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez corriger les erreurs dans le formulaire',
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reader.onload = (e: any) => {
        this.profileForm.patchValue({ photo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  getAvatarUrl(): string {
    const photo = this.profileForm.get('photo')?.value || this.profile()?.photo;
    return photo || this.defaultAvatar;
  }

  getStatusSeverity(): string {
    return this.profile()?.compteOff ? 'danger' : 'success';
  }

  getStatusLabel(): string {
    return this.profile()?.compteOff ? 'Hors ligne' : 'En ligne';
  }

  getCompteTypeLabel(): string {
    const compte =
      this.profile()?.compte || this.profileForm.get('compte')?.value;
    return compte === 'partenaire' ? 'Partenaire' : 'Particulier';
  }

  getCompteTypeSeverity(): string {
    const compte =
      this.profile()?.compte || this.profileForm.get('compte')?.value;
    return compte === 'partenaire' ? 'info' : 'success';
  }
}

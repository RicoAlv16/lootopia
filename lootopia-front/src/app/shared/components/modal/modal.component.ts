import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { PaymentMethodesInterface } from '../../../routes/pricing/payment-methodes/payment-methodes.interface';
import { InputOtp } from 'primeng/inputotp';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';
import { DecompteurService } from '../../services/decompteur/decompteur.service';
// Imports pour le formulaire de chasse
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';
import { HuntForm } from '../../../routes/chasses/chasses.interface';
import { Toast } from 'primeng/toast';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-modal',
  imports: [
    Dialog,
    DialogModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    IftaLabelModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputOtp,
    Toast,
    CardModule,
    // Modules pour le formulaire de chasse
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
    TextareaModule,
    SelectButtonModule,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
  @Input() visible = false;
  @Input() isPaymentMethode = false;
  @Input() paymentStatus = '';
  @Input() paymentMethods_S = signal<PaymentMethodesInterface[]>([]);
  @Input() paymentType = '';
  @Input() montant = 0;
  @Input() validatePayment:
    | ((montant: number, keyword: string) => void)
    | undefined;
  @Input() messageSiginSuccess = '';
  @Input() messageSiginValidate = '';
  @Input() isSuccessModal = false;
  @Input() isOPTModal = false;
  codeOPT: number | null = null;
  @Input() login: ((codeOPT: number) => void) | undefined;
  @Input() verifyCredentials: ((codeOPT: number) => void) | undefined;
  @Input() isCreateHuntModal = false;
  @Input() visibleCreateHunt = false;

  // Inputs pour le formulaire de chasse (reçus du parent)
  @Input() huntForm!: HuntForm;
  @Input() worldTypeOptions: { label: string; value: string }[] = [];
  @Input() modeOptions: { label: string; value: string }[] = [];
  @Input() mapSkinOptions: { label: string; value: string }[] = [];
  @Input() validationTypeOptions: { label: string; value: string }[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() isPaymentMethodeChange = new EventEmitter<boolean>();
  // @Output() isPaymentSuccesChange = new EventEmitter<string>();
  @Output() paymentTypeChange = new EventEmitter<string>();
  @Output() isSuccessModalChange = new EventEmitter<boolean>();
  @Output() isOPTModalChange = new EventEmitter<boolean>();
  @Output() codeOPTChange = new EventEmitter<number>();
  @Output() isCreateHuntModalChange = new EventEmitter<boolean>();
  @Output() visibleCreateHuntChange = new EventEmitter<boolean>();

  // Outputs pour les actions du formulaire de chasse
  @Output() createHunt = new EventEmitter<void>();
  @Output() saveDraft = new EventEmitter<void>();
  @Output() addStep = new EventEmitter<void>();
  @Output() removeStep = new EventEmitter<number>();
  @Output() addLandmark = new EventEmitter<void>();
  @Output() removeLandmark = new EventEmitter<number>();

  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (event.key === 'Escape') this.closeDialog();
  }

  private toastService = inject(ToastService);
  private router = inject(Router);
  private decompteurService = inject(DecompteurService);
  countdown = '00:00';

  ngOnInit() {
    console.log(this.codeOPT);
    // Lancement automatique du décompte
    this.decompteurService.countdown$.subscribe(time => {
      this.countdown = time;
    });
    if (this.verifyCredentials) {
      this.decompteurService.startCountdown(5);
    }
  }

  // Ajouter ces @Input() dans modal.component.ts
  @Input() createHuntMethod!: () => void;
  @Input() addStepMethod!: () => void;
  @Input() removeStepMethod!: (index: number) => void;
  @Input() addLandmarkMethod!: () => void;
  @Input() removeLandmarkMethod!: (index: number) => void;
  @Input() saveDraftMethod!: () => void;
  @Input() createButtonText = 'Créer la chasse';
  @Input() isLoading!: WritableSignal<boolean>;

  showDialog() {
    this.visible = true;
    this.isPaymentMethode = true;
    this.paymentMethods_S();
    this.isSuccessModal = true;
    this.isOPTModal = true;
    console.log(this.codeOPT);
  }

  closeDialog() {
    this.visible = false;
    this.isPaymentMethode = false;
    this.isOPTModal = false;
    this.isCreateHuntModal = false;
    this.visibleCreateHunt = false;

    this.visibleChange.emit(this.visible);
    this.isPaymentMethodeChange.emit(this.isPaymentMethode);
    this.isSuccessModalChange.emit(this.isSuccessModal);
    this.isOPTModalChange.emit(this.isOPTModal);
    this.isCreateHuntModalChange.emit(this.isCreateHuntModal);
    this.visibleCreateHuntChange.emit(this.visibleCreateHunt);
  }

  resendCode() {
    this.decompteurService.resetCountdown();
    this.toastService.showSuccess(
      'Un nouveau code de validation a été reenvoyé.'
    );
  }

  onClickPaymentMode(keyword: string) {
    this.paymentTypeChange.emit(keyword);
    this.closeDialog();
    if (this.validatePayment) {
      this.validatePayment(this.montant, keyword);
    }
  }

  onClickValidateCode() {
    if (!this.codeOPT) {
      this.toastService.showServerError(
        'Veuillez entrer le code de validation'
      );
      return;
    }

    if (this.codeOPT.toString().length !== 6) {
      this.toastService.showServerError('Le code doit contenir 6 chiffres');
      return;
    }

    if (this.login) {
      this.login(this.codeOPT);
      this.codeOPT = null;
    } else {
      this.toastService.showServerError('Une erreur est survenue');
    }
  }
}

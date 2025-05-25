import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
// import { FloatLabel } from 'primeng/floatlabel';
// import { IconField } from 'primeng/iconfield';
import { IftaLabelModule } from 'primeng/iftalabel';
// import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { PaymentMethodesInterface } from '../../../routes/pricing/payment-methodes/payment-methodes.interface';
import { InputOtp } from 'primeng/inputotp';
import { Toast } from 'primeng/toast';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-modal',
  imports: [
    Dialog,
    DialogModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    // InputIcon,
    // IconField,
    // FloatLabel,
    IftaLabelModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputOtp,
    Toast,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() visible = false;
  @Input() isPaymentMethode = false;
  @Input() isPaymentSucces = false;
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

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() isPaymentMethodeChange = new EventEmitter<boolean>();
  @Output() isPaymentSuccesChange = new EventEmitter<boolean>();
  @Output() paymentTypeChange = new EventEmitter<string>();
  @Output() isSuccessModalChange = new EventEmitter<boolean>();
  @Output() isOPTModalChange = new EventEmitter<boolean>();
  @Output() codeOPTChange = new EventEmitter<number>();

  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (event.key === 'Escape') this.closeDialog();
  }

  private toastService = inject(ToastService);
  private router = inject(Router);

  showDialog() {
    this.visible = true;
    this.isPaymentMethode = true;
    this.isPaymentSucces = true;
    this.paymentMethods_S();
    this.isSuccessModal = true;
    this.isOPTModal = true;
    console.log(this.codeOPT);
  }

  closeDialog() {
    this.visible = false;
    this.isPaymentMethode = true;
    this.isPaymentSucces = true;
    this.isOPTModal = false;

    this.visibleChange.emit(this.visible);
    this.isPaymentMethodeChange.emit(this.visible);
    this.isPaymentSuccesChange.emit(this.visible);
    this.isSuccessModalChange.emit(this.isSuccessModal);
    this.isOPTModalChange.emit(this.isOPTModal);
  }

  resendCode() {
    this.toastService.showSuccess('Un code de validation a été reenvoyé.');
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
      // this.closeDialog();
    } else {
      this.toastService.showServerError('Une erreur est survenue');
    }
  }
}

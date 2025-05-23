import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
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

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() isPaymentMethodeChange = new EventEmitter<boolean>();
  @Output() isPaymentSuccesChange = new EventEmitter<boolean>();
  @Output() paymentTypeChange = new EventEmitter<string>();

  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (event.key === 'Escape') this.closeDialog();
  }

  showDialog() {
    this.visible = true;
    this.isPaymentMethode = true;
    this.isPaymentSucces = true;
    this.paymentMethods_S();
  }

  closeDialog() {
    this.visible = false;
    this.isPaymentMethode = true;
    this.isPaymentSucces = true;

    this.visibleChange.emit(this.visible);
    this.isPaymentMethodeChange.emit(this.visible);
    this.isPaymentSuccesChange.emit(this.visible);
  }

  onClickPaymentMode(keyword: string) {
    this.paymentTypeChange.emit(keyword);
    this.closeDialog();
    // console.log('payment start', keyword);
    if (this.validatePayment) {
      this.validatePayment(this.montant, keyword);
    }
  }
}

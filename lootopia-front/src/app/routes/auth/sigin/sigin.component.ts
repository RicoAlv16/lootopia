import { SiginResponsInterface } from './sigin.interface';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Toast } from 'primeng/toast';
import { SiginService } from './sigin.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-sigin',
  imports: [
    Dialog,
    DialogModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    InputIcon,
    IconField,
    FloatLabel,
    IftaLabelModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Toast,
    ProgressSpinner,
    ModalComponent,
  ],
  providers: [MessageService, ToastService],
  standalone: true,
  templateUrl: './sigin.component.html',
  styleUrl: './sigin.component.css',
})
export class SiginComponent {
  @Input() visibleSign = false;
  @Output() visibleSignChange = new EventEmitter<boolean>();
  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (event.key === 'Escape') this.closeDialog();
  }
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  public siginForm: FormGroup;
  private siginService = inject(SiginService);

  password!: string;

  constructor() {
    this.siginForm = this.fb.group({
      nickname: [
        null,
        Validators.compose([Validators.nullValidator, Validators.required]),
      ],
      email: [
        null,
        Validators.compose([Validators.email, Validators.required]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          this.siginService.passwordStrengthValidator,
        ]),
      ],
    });
  }

  showDialog() {
    this.visibleSign = true;
  }

  visibleSiginSuccess = false;
  isSuccessModal = false;
  closeJustDialog() {
    this.visibleSign = false;
  }

  closeDialog() {
    this.visibleSign = false;
    this.visibleSignChange.emit(this.visibleSign);
    this.visibleSiginSuccess = true;
    this.isSuccessModal = true;
  }

  messageSiginSuccess = '';
  messageSiginValidate = '';
  isLoading = signal<boolean>(false);
  siginResponse = signal<SiginResponsInterface | null>(null);

  sigin() {
    if (this.siginForm.valid) {
      const siginPostData = {
        ...this.siginForm.value,
        roles: ['participant'],
      };
      this.isLoading.set(true);
      this.siginService.sigin(siginPostData).subscribe({
        next: res => {
          if (res) {
            this.siginResponse.set(res);
            this.messageSiginSuccess = `Un lien vous a été envoyé sur votre adresse mail ${res.email}`;
            this.messageSiginValidate =
              'Veuillez cliquer sur le lien pour valider votre compte. Il est valable que 24h';
            this.siginForm.reset();
            this.closeDialog();
          }
          this.isLoading.set(false);
        },
        error: err => {
          console.log('Erreur =', err);
          this.toastService.showServerError(err.error?.message);
          this.siginForm.reset();
          this.isLoading.set(false);
        },
      });
    } else {
      this.toastService.showInvalidTap();
    }
  }
}

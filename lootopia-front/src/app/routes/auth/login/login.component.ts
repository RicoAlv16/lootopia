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
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { FloatLabel } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { LoginResponseInterface } from './login.interface';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { Checkbox, CheckboxChangeEvent } from 'primeng/checkbox';
import { AuthService } from '../../../shared/services/auth/auth.services';

@Component({
  selector: 'app-login',
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
    ModalComponent,
    ProgressSpinner,
    Checkbox,
  ],
  providers: [MessageService, ToastService],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (event.key === 'Escape') this.closeDialog();
  }
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private toastService = inject(ToastService);
  public loginForm: FormGroup;
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.loginForm = this.fb.group({
      email: [
        null,
        Validators.compose([Validators.email, Validators.required]),
      ],
      password: [
        null,
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
    });
  }

  visibleRGPD = false;
  showDialog() {
    this.visible = true;
    this.visibleRGPD = true;
  }

  visibleLoginSuccess = false;
  isOPTModal = false;
  closeJustDialog() {
    this.visible = false;
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.visibleLoginSuccess = true;
    this.isOPTModal = true;
  }

  isLoading = signal<boolean>(false);
  loginResponse = signal<LoginResponseInterface | null>(null);

  rgpd = false;
  onRGPDChange(event: CheckboxChangeEvent) {
    this.rgpd = event.checked;
    console.log('RGPD checked?', this.rgpd);
  }

  verifyCredentials() {
    console.log(this.rgpd);
    if (this.loginForm.valid && this.rgpd) {
      this.isLoading.set(true);
      this.loginService.verifyCredentials(this.loginForm.value).subscribe({
        next: response => {
          if (response) {
            this.loginForm.reset();
            this.closeDialog();
          }

          this.isLoading.set(false);
        },
        error: err => {
          this.toastService.showServerError(err.error?.message);
          this.loginForm.reset();
          this.isLoading.set(false);
        },
      });
    } else {
      this.toastService.showInvalidTap();
    }
  }

  login(codeOPT: number): void {
    if (codeOPT) {
      this.isLoading.set(true);
      this.loginService.login({ codeOPT: codeOPT }).subscribe({
        next: response => {
          if (response) {
            this.visibleLoginSuccess = true;
            this.isOPTModal = true;
            this.loginResponse.set(response);
            this.authService.setUser(response);
            this.router.navigate(['/sidebar/user']);
          }
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Erreur lors de la connexion', err);
          this.toastService.showServerError(err.error?.message);
        },
      });
    }
  }
}

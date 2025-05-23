import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
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
  ],
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
  public loginForm: FormGroup;

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

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    console.log('Le visible fermé : ' + this.visible);
  }

  login() {
    this.loginForm.reset();
    this.closeDialog();
  }
}

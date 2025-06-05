import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SiginService } from '../sigin.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VerifyTokenRequest } from '../sigin.interface';

@Component({
  selector: 'app-verify-mail',
  imports: [ButtonModule, Toast],
  standalone: true,
  providers: [MessageService, ToastService],
  templateUrl: './verify-mail.component.html',
  styleUrl: './verify-mail.component.css',
})
export class VerifyMailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private siginService = inject(SiginService);
  private toastService = inject(ToastService);
  token: string | null = null;
  isVerified = false;

  ngOnInit() {
    this.verifyAccount();
  }

  connexion() {
    this.router.navigate(['/home']);
  }

  resendMail() {
    this.toastService.showSuccess(
      'Un mail de confirmation a été envoyé avec le nouveau lien.'
    );
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 4000);
  }

  tokenData = new VerifyTokenRequest();

  verifyAccount() {
    this.tokenData.token =
      this.route.snapshot.paramMap.get('token') || undefined;
    if (this.tokenData.token) {
      this.siginService.verifyAccount(this.tokenData).subscribe({
        next: res => {
          if (res) {
            this.isVerified = res;
            console.log('la verif=', res);
          }
        },
        error: err => {
          console.log(err);
          this.toastService.showServerError(err.error?.message);
        },
      });
    }
  }
}

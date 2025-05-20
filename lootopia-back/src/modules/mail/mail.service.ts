import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Vérification de votre compte Lootopia',
      html: `
        <h1>Bienvenue sur Lootopia !</h1>
        <p>Pour vérifier votre compte, veuillez cliquer sur le lien suivant :</p>
        <a href="${verificationLink}">Vérifier mon compte</a>
        <p>Ce lien expire dans 24 heures.</p>
      `,
    });
  }

  async sendOPTCode(email: string, codeOPT: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Code de vérification multifacteurs - Lootopia',
      html: `
        <h1>Bienvenue sur Lootopia !</h1>
        <p>Votre code de vérification est : ${codeOPT}</p>
        <p>Ce code expire dans 5 min.</p>
      `,
    });
  }
}

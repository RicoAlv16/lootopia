import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient;
  private verifyServiceSid = 'VA7011e40815a2c91e9140f96bbbdb5940';

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    this.twilioClient = twilio(accountSid, authToken);
  }

  async sendVerificationSMS(phoneNumber: string): Promise<boolean> {
    try {
      const verification = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({ to: phoneNumber, channel: 'sms' });
      return verification.status === 'pending';
    } catch (error) {
      console.error("Erreur lors de l'envoi du code de vérification:", error);
      return false;
    }
  }

  async checkVerificationCode(
    phoneNumber: string,
    code: string,
  ): Promise<boolean> {
    try {
      const verificationCheck = await this.twilioClient.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({ to: phoneNumber, code: code });

      return verificationCheck.status === 'approved';
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      return false;
    }
  }
}

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginPostDto } from 'src/shared/dto/login-post.dto';
import { LoginRespDto } from 'src/shared/dto/login-resp.dto';
import { ProfileEntity } from 'src/shared/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private profileService: ProfileService,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
  ) {}

  private generateOTPCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTPCode(profileEmail: string): Promise<boolean> {
    try {
      const profile = await this.profileService.findprofileByUser(profileEmail);
      if (profile) {
        const otpCode = this.generateOTPCode();
        profile.codeOPT = otpCode;
        profile.expiredOPT = new Date(Date.now() + 5 * 60 * 1000);
        await this.profileRepository.save(profile);

        if (profile.acceptMFA && profile.telephone) {
          // Implémenter l'envoi SMS ici
        }
        if (profileEmail) {
          await this.mailService.sendOPTCode(profileEmail, otpCode);
        }
      }
      return true;
    } catch (error) {
      throw new HttpException(
        `Erreur lors de l'envoi du code OPT: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async VerifyCredentials(userData: LoginPostDto): Promise<boolean> {
    try {
      const user = await this.usersService.getUserByMail(userData.email);

      if (!user.isVerified) {
        throw new HttpException(
          "Veuillez vérifier votre compte avant d'accéder à la plateforme",
          HttpStatus.FORBIDDEN,
        );
      }

      if (user && (await bcrypt.compare(userData.password, user.password))) {
        const sendOPT = await this.sendOTPCode(user.email);
        if (sendOPT) {
          return true;
        }
      }
      throw new UnauthorizedException('Identifiants incorrectes');
    } catch (error) {
      throw new UnauthorizedException(`${error.message}`);
    }
  }

  async login(codeOPT: string): Promise<LoginRespDto> {
    try {
      const profile = await this.profileService.findProfileByCodeOPT(codeOPT);

      if (!profile) {
        throw new HttpException(
          'Code de vérification invalide',
          HttpStatus.NOT_FOUND,
        );
      }

      if (profile.expiredOPT < new Date()) {
        throw new HttpException(
          'Le code de vérification a expiré',
          HttpStatus.BAD_REQUEST,
        );
      }

      profile.codeOPT = ''; // Réinitialiser le code OTP après vérification
      profile.expiredOPT = null; // Réinitialiser la date d'expiration après vérification
      await this.profileRepository.save(profile);

      const payload = {
        email: profile.user.email,
        sub: profile.id,
        roles: profile.user.roles.map((theRole) => theRole.role),
      };
      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        nickname: profile.user.nickname,
        email: profile.user.email,
        roles: profile.user.roles.map((theRole) => theRole.role),
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la vérification du code OPT: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

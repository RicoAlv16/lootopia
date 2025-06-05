import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ProfileEntity } from 'src/shared/entities/profile.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    private readonly rolesService: RolesService,
    private readonly mailService: MailService,
  ) {}

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return !!user;
  }

  async createUser(userData: CreateUserDto): Promise<UsersEntity> {
    try {
      const emailExists = await this.checkEmailExists(userData.email);
      if (emailExists) {
        throw new HttpException(
          'Cet email est déjà utilisé',
          HttpStatus.CONFLICT,
        );
      }

      const userRoles = await Promise.all(
        userData.roles.map(async (roleName) => {
          const role = await this.rolesService.findRoleByName(roleName);
          if (!role) {
            throw new HttpException(
              `Role ${roleName} n'existe pas encore dans le système`,
              HttpStatus.NOT_FOUND,
            );
          }
          return role;
        }),
      );

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = this.usersRepository.create({
        ...userData,
        password: hashedPassword,
        roles: userRoles,
        isVerified: false,
      });

      const savedUser = await this.usersRepository.save(user);

      // Générer et sauvegarder le token de vérification
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const token = new ProfileEntity();
      token.token = verificationToken;
      token.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
      token.user = savedUser;
      await this.profileRepository.save(token);

      // Envoyer l'email de vérification
      await this.mailService.sendVerificationEmail(
        user.email,
        verificationToken,
      );

      return savedUser;
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la création de l'utilisateur: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers(): Promise<UsersEntity[]> {
    try {
      return await this.usersRepository.find({
        relations: ['roles'], // Inclure les relations avec les rôles
      });
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération des utilisateurs: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserByMail(email: string): Promise<UsersEntity> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        relations: ['roles'],
      });

      if (!user) {
        throw new HttpException(
          `Utilisateur avec l'email ${email} non trouvé`,
          HttpStatus.NOT_FOUND,
        );
      }

      return user;
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la recherche de l'utilisateur: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const profile = await this.profileRepository.findOne({
        where: { token },
        relations: ['user'],
      });

      if (!profile) {
        throw new HttpException(
          'Token de vérification invalide',
          HttpStatus.NOT_FOUND,
        );
      }

      if (profile.expiresAt < new Date()) {
        throw new HttpException(
          'Le token de vérification a expiré',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Mettre à jour le statut de vérification de l'utilisateur
      const user = profile.user;
      user.isVerified = true;
      await this.usersRepository.save(user);

      // Mettre à jour le token au lieu de le supprimer
      profile.token = 'compte vérifié';
      await this.profileRepository.save(profile);

      return true;
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la vérification de l'email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

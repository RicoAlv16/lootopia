import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { ProfileEntity } from 'src/shared/entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async findprofileByUser(userEmail: string): Promise<ProfileEntity> {
    try {
      return this.profileRepository.findprofileByUser(userEmail);
    } catch (error) {
      throw new HttpException(
        `Error getting profile by user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findProfileByCodeOPT(codeOPT: string): Promise<ProfileEntity> {
    try {
      return this.profileRepository.findProfileByCodeOPT(codeOPT);
    } catch (error) {
      throw new HttpException(
        `Error getting profile by user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
async creditUser(userId: number, amount: number): Promise<void> {
  try {
    await this.profileRepository.creditBalance(userId, amount);
  } catch (error) {
    throw new HttpException(
      `Erreur lors du crédit du solde : ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    }
  }

  async debitUser(userId: number, amount: number): Promise<void> {
  try {
    await this.profileRepository.debitBalance(userId, amount);
  } catch (error) {
    throw new HttpException(
      `Erreur lors du débit du solde : ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

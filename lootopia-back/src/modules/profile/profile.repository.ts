import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/shared/entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
  ) {}

  async getAllProfiles(): Promise<ProfileEntity[]> {
    try {
      return await this.profileRepository.find({
        relations: ['user'],
      });
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération des profiles: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findprofileByUser(userEmail: string): Promise<ProfileEntity> {
    try {
      return await this.profileRepository.findOne({
        where: { user: { email: userEmail } },
        relations: ['user', 'user.roles'],
      });
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération du profile: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findProfileByCodeOPT(codeOPT: string): Promise<ProfileEntity> {
    try {
      return await this.profileRepository.findOne({
        where: { codeOPT: codeOPT },
        relations: ['user', 'user.roles'],
      });
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération du profile: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

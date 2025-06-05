import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async creatUser(userData: CreateUserDto): Promise<UsersEntity> {
    try {
      return this.usersRepository.createUser(userData);
    } catch (error) {
      throw new HttpException(
        `Error saving user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers(): Promise<UsersEntity[]> {
    try {
      return this.usersRepository.getAllUsers();
    } catch (error) {
      throw new HttpException(
        `Error getting user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserByMail(email: string): Promise<UsersEntity> {
    try {
      return this.usersRepository.findUserByMail(email);
    } catch (error) {
      throw new HttpException(
        `Error getting user by mail: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      return this.usersRepository.verifyEmail(token);
    } catch (error) {
      throw new HttpException(
        `Erreur de verification de compte: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

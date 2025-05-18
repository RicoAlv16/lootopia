import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    private readonly rolesService: RolesService,
  ) {}

  async createUser(userData: CreateUserDto): Promise<UsersEntity> {
    try {
      // Récupérer les rôles existants
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

      // Créer l'utilisateur avec les rôles
      const user = this.usersRepository.create({
        ...userData,
        roles: userRoles,
      });

      const savedUser = await this.usersRepository.save(user);
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

  async findUserById(id: number): Promise<UsersEntity> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['roles'],
      });

      if (!user) {
        throw new HttpException(
          `Utilisateur avec l'ID ${id} non trouvé`,
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
}

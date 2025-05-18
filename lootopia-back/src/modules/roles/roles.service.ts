import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from 'src/shared/dto/create-role.dto';
import { PermissionsEntity } from 'src/shared/entities/permissions.entity';
import { RolesEntity } from 'src/shared/entities/roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
    @InjectRepository(PermissionsEntity)
    private readonly permissionsRepository: Repository<PermissionsEntity>,
  ) {}

  async createRole(roleData: CreateRoleDto): Promise<RolesEntity> {
    try {
      // Créer les permissions d'abord
      const permissions = await Promise.all(
        roleData.permissions.map((permData) =>
          this.permissionsRepository.save(permData),
        ),
      );

      // Créer le rôle avec les permissions
      const role = this.rolesRepository.create({
        role: roleData.role,
        description: roleData.description,
        permissions: permissions,
      });

      return await this.rolesRepository.save(role);
    } catch (error) {
      throw new HttpException(
        `Error saving role with permissions: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllRoles(): Promise<CreateRoleDto[]> {
    try {
      const roles = await this.rolesRepository.find();
      return roles;
    } catch (error) {
      throw new HttpException(
        `Error getting roles: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findRoleByName(roleName: string): Promise<RolesEntity> {
    return await this.rolesRepository.findOne({ where: { role: roleName } });
  }
}

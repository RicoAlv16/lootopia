import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto } from 'src/shared/dto/create-permission.dto';
import { PermissionsEntity } from 'src/shared/entities/permissions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  @InjectRepository(PermissionsEntity)
  private readonly permissionsRepository: Repository<PermissionsEntity>;

  async creatPermission(
    permission: CreatePermissionDto,
  ): Promise<PermissionsEntity> {
    try {
      const savedPermission = await this.permissionsRepository.save(permission);
      return savedPermission;
    } catch (error) {
      throw new HttpException(
        `Error saving Permission: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPermissions(): Promise<CreatePermissionDto[]> {
    try {
      const permissions = await this.permissionsRepository.find();
      return permissions;
    } catch (error) {
      throw new HttpException(
        `Error getting Permissions: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

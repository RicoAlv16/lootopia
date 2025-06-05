import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { CreatePermissionDto } from 'src/shared/dto/create-permission.dto';
import { PermissionsService } from './permissions.service';
import { PermissionsEntity } from 'src/shared/entities/permissions.entity';

@Controller('permissions')
export class PermissionsController {
  private logger = new Logger(PermissionsController.name);
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async createPermission(
    @Body() permissionData: CreatePermissionDto,
  ): Promise<PermissionsEntity> {
    this.logger.verbose(
      `Creating permission: ${JSON.stringify(permissionData)}`,
    );
    return await this.permissionsService.creatPermission(permissionData);
  }

  @Get()
  async getAllPermissions(): Promise<CreatePermissionDto[]> {
    return await this.permissionsService.getAllPermissions();
  }
}

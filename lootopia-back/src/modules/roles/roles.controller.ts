import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { CreateRoleDto } from 'src/shared/dto/create-role.dto';
import { RolesService } from './roles.service';
import { RolesEntity } from 'src/shared/entities/roles.entity';

@Controller('roles')
export class RolesController {
  private readonly logger = new Logger(RolesController.name);
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() roleData: CreateRoleDto): Promise<RolesEntity> {
    this.logger.verbose(`Creating role: ${JSON.stringify(roleData)}`);
    return await this.rolesService.createRole(roleData);
  }

  @Get()
  async getAllRoles(): Promise<CreateRoleDto[]> {
    return await this.rolesService.getAllRoles();
  }
}

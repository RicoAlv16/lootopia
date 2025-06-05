import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsEntity } from 'src/shared/entities/permissions.entity';
import { RolesEntity } from 'src/shared/entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity, PermissionsEntity])],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}

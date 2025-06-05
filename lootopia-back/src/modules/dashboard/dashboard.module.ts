import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DashboardDataEntity } from '../../shared/entities/dashboard-data.entity';
import { UsersEntity } from '../../shared/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DashboardDataEntity, UsersEntity])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}

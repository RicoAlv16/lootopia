import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardDataEntity } from '../../shared/entities/dashboard-data.entity';
import { UsersEntity } from '../../shared/entities/users.entity';
import { UpdateDashboardDataDto } from 'src/shared/dto/dashboard-data.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DashboardDataEntity)
    private dashboardRepository: Repository<DashboardDataEntity>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async getDashboardData(userEmail: string): Promise<DashboardDataEntity> {
    const user = await this.usersRepository.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    let dashboardData = await this.dashboardRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    // Si aucune donnée n'existe, créer des données par défaut
    if (!dashboardData) {
      dashboardData = await this.createDefaultDashboardData(user);
    }

    return dashboardData;
  }

  async updateDashboardData(
    userEmail: string,
    updateData: UpdateDashboardDataDto,
  ): Promise<DashboardDataEntity> {
    const user = await this.usersRepository.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    let dashboardData = await this.dashboardRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!dashboardData) {
      dashboardData = await this.createDefaultDashboardData(user);
    }

    // Mettre à jour les données
    Object.assign(dashboardData, updateData);

    return await this.dashboardRepository.save(dashboardData);
  }

  private async createDefaultDashboardData(
    user: UsersEntity,
  ): Promise<DashboardDataEntity> {
    const defaultData = this.dashboardRepository.create({
      user,
      completedHunts: 0,
      huntsGoal: 100,
      artifactsCount: 0,
      totalArtifacts: 150,
      ranking: 'Débutant',
      crowns: 0,
      recentActivities: [],
      progressionData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Niveau',
            data: [0, 0, 0, 0, 0, 0],
            fill: false,
            borderColor: '#4CAF50',
            tension: 0.4,
          },
          {
            label: 'Chasses',
            data: [0, 0, 0, 0, 0, 0],
            fill: false,
            borderColor: '#81C784',
            tension: 0.4,
          },
          {
            label: 'Couronnes',
            data: [0, 0, 0, 0, 0, 0],
            fill: false,
            borderColor: '#FFA726',
            tension: 0.4,
          },
        ],
      },
      artifactsList: [],
      activeHunts: [],
      badges: [],
    });

    return await this.dashboardRepository.save(defaultData);
  }

  async incrementCompletedHunts(userEmail: string): Promise<void> {
    const dashboardData = await this.getDashboardData(userEmail);
    dashboardData.completedHunts += 1;
    await this.dashboardRepository.save(dashboardData);
  }

  async addCrowns(userEmail: string, crowns: number): Promise<void> {
    const dashboardData = await this.getDashboardData(userEmail);
    dashboardData.crowns += crowns;
    await this.dashboardRepository.save(dashboardData);
  }

  async addArtifact(userEmail: string, artifact: any): Promise<void> {
    const dashboardData = await this.getDashboardData(userEmail);
    dashboardData.artifactsList.push(artifact);
    dashboardData.artifactsCount = dashboardData.artifactsList.length;
    await this.dashboardRepository.save(dashboardData);
  }

  async addRecentActivity(userEmail: string, activity: any): Promise<void> {
    const dashboardData = await this.getDashboardData(userEmail);
    dashboardData.recentActivities.unshift(activity);
    // Garder seulement les 10 dernières activités
    if (dashboardData.recentActivities.length > 10) {
      dashboardData.recentActivities = dashboardData.recentActivities.slice(
        0,
        10,
      );
    }
    await this.dashboardRepository.save(dashboardData);
  }
}

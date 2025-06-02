import { Controller, Put, Body, Post } from '@nestjs/common';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { UpdateDashboardDataDto } from '../../shared/dto/dashboard-data.dto';

@Controller('dashboard')
// @UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post()
  async getDashboardData(@Body() req: { email: string }) {
    return await this.dashboardService.getDashboardData(req.email);
  }

  @Put()
  async updateDashboardData(
    @Body() updateData: UpdateDashboardDataDto & { email: string },
  ) {
    return await this.dashboardService.updateDashboardData(
      updateData.email,
      updateData,
    );
  }

  @Put('increment-hunts')
  async incrementCompletedHunts(@Body() req: { email: string }) {
    await this.dashboardService.incrementCompletedHunts(req.email);
    return { message: 'Chasses complétées incrémentées' };
  }

  @Put('add-crowns')
  async addCrowns(@Body() req: { email: string; crowns: number }) {
    await this.dashboardService.addCrowns(req.email, req.crowns);
    return { message: 'Couronnes ajoutées' };
  }

  @Put('add-artifact')
  async addArtifact(@Body() req: { email: string; artifact: any }) {
    await this.dashboardService.addArtifact(req.email, req.artifact);
    return { message: 'Artefact ajouté' };
  }

  @Put('add-activity')
  async addRecentActivity(@Body() req: { email: string; activity: any }) {
    await this.dashboardService.addRecentActivity(req.email, req.activity);
    return { message: 'Activité ajoutée' };
  }
}

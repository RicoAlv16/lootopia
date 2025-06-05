import { Controller, Post, Body, Logger, Get } from '@nestjs/common';
import { HuntsService } from './hunts.service';
import { CreateHuntDto } from '../../shared/dto/create-hunt.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Hunt } from 'src/shared/entities/hunt.entity';
import { HuntParticipation } from 'src/shared/entities/hunt-participation.entity';

@Controller('hunts')
@UseGuards(JwtAuthGuard)
export class HuntsController {
  private readonly logger = new Logger(HuntsController.name);
  constructor(private readonly huntsService: HuntsService) {}

  @Post('/create-hunt')
  async create(@Body() createHuntDto: CreateHuntDto & { email: string }) {
    return this.huntsService.create(createHuntDto, createHuntDto.email);
  }

  @Post('my-hunts')
  async findAll(@Body() req: { email: string }): Promise<Hunt[]> {
    this.logger.verbose(`Getting hunts by user: ${JSON.stringify(req.email)}`);
    return this.huntsService.findAllByUser(req.email);
  }

  @Post('hunt-details')
  async findOne(@Body() req: { id: string; email: string }) {
    return this.huntsService.findOne(req.id, req.email);
  }

  @Post('update-hunt')
  async update(
    @Body()
    req: {
      id: string;
      email: string;
      updateData: Partial<CreateHuntDto>;
    },
  ) {
    return this.huntsService.update(req.id, req.updateData, req.email);
  }

  @Post('delete-hunt')
  async remove(@Body() req: { id: string; email: string }) {
    return this.huntsService.remove(req.id, req.email);
  }

  @Post('publish-hunt')
  async publish(@Body() req: { id: string; email: string }) {
    this.logger.verbose(
      `Publishing hunts by user: ${JSON.stringify(req.email)}`,
    );
    return this.huntsService.publish(req.id, req.email);
  }

  @Get('active-hunts')
  async findAllActiveHunts(): Promise<Hunt[]> {
    this.logger.verbose('Getting all active hunts');
    return this.huntsService.findAllActiveHunts();
  }

  @Post('/join')
  async joinHunt(
    @Body() req: { huntId: string; email: string },
  ): Promise<HuntParticipation> {
    return await this.huntsService.joinHunt(req.huntId, req.email);
  }

  @Post('/leave')
  async leaveHunt(@Body() req: { huntId: string; email: string }) {
    await this.huntsService.leaveHunt(req.huntId, req.email);
    return { message: 'Vous avez quitté la chasse' };
  }

  @Post('my-participations')
  async getMyParticipations(
    @Body() req: { email: string },
  ): Promise<HuntParticipation[]> {
    return await this.huntsService.getUserParticipations(req.email);
  }
}

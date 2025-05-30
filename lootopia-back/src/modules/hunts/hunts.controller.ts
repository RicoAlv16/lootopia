import { Controller, Post, Body, Logger } from '@nestjs/common';
import { HuntsService } from './hunts.service';
import { CreateHuntDto } from '../../shared/dto/create-hunt.dto';
// import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Hunt } from 'src/shared/entities/hunt.entity';

@Controller('hunts')
// @UseGuards(JwtAuthGuard)
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
}

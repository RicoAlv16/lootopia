import { Controller, Get, Query } from '@nestjs/common';
import { ArtefactService } from './artefact.service';

@Controller('artefacts')
export class ArtefactController {
  constructor(private readonly artefactService: ArtefactService) {}

  @Get('my')
  async getMyArtefacts(@Query('userId') userId: number) {
    return this.artefactService.getMyArtefacts(userId);
  }
}
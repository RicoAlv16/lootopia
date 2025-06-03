import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ArtefactService } from './artefact.service';

@UseGuards(AuthGuard('jwt'))
@Controller('artefacts')
export class ArtefactController {
  constructor(private readonly artefactService: ArtefactService) {}

  @Get('my')
  async getMyArtefacts(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.artefactService.getArtefactsByUser(userId);
  }
}
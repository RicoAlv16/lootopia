import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artefact } from 'src/shared/entities/artefact.entity';

@Injectable()
export class ArtefactService {
  constructor(
    @InjectRepository(Artefact)
    private artefactRepo: Repository<Artefact>
  ) {}

  async getMyArtefacts(userId: number): Promise<Artefact[]> {
    return this.artefactRepo.find({
      where: {
        owner: { id: userId },
        isInAuction: false,
      },
      relations: ['loot'],
    });
  }
}

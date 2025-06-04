import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artefact } from 'src/shared/entities/artefact.entity';

@Injectable()
export class ArtefactService {
  constructor(
    @InjectRepository(Artefact)
    private readonly artefactRepo: Repository<Artefact>
  ) {}

  async getArtefactsByUser(userId: number): Promise<Artefact[]> {
    return this.artefactRepo.find({
      where: {
        owner: { id: userId },
        isInAuction: false,
      },
      relations: ['loot'],
    });
  }

  async getAllArtefactsByUser(userId: number): Promise<Artefact[]> {
    return this.artefactRepo.find({
      where: {
        owner: { id: userId },
      },
      relations: ['loot'],
    });
  }

}
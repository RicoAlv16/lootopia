import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Artefact } from 'src/shared/entities/artefact.entity';
import { UsersEntity } from 'src/shared/entities/users.entity';

import { ArtefactController } from './artefact.controller';
import { ArtefactService } from './artefact.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artefact, UsersEntity]),
  ],
  controllers: [ArtefactController],
  providers: [ArtefactService],
  exports: [ArtefactService],
})
export class ArtefactModule {}

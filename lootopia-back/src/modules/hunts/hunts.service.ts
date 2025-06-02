import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { Hunt } from '../../shared/entities/hunt.entity';
import { CreateHuntDto } from '../../shared/dto/create-hunt.dto';
import { UsersEntity } from '../../shared/entities/users.entity';
import { HuntParticipation } from 'src/shared/entities/hunt-participation.entity';

@Injectable()
export class HuntsService {
  constructor(
    @InjectRepository(Hunt)
    private huntRepository: Repository<Hunt>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(HuntParticipation)
    private huntParticipationRepository: Repository<HuntParticipation>,
  ) {}

  async create(createHuntDto: CreateHuntDto, email: string): Promise<Hunt> {
    // Trouver l'utilisateur par email
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const hunt = this.huntRepository.create({
      ...createHuntDto,
      userId: user.id.toString(),
      participants: 0,
      status: createHuntDto.mode === 'private' ? 'private' : 'draft',
    });

    return await this.huntRepository.save(hunt);
  }

  async findAllByUser(email: string): Promise<Hunt[]> {
    try {
      const hunts = await this.huntRepository.find({
        where: {
          user: {
            email: email,
          },
          status: Not(Equal('active')), // Exclure les chasses actives
        },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });

      if (!hunts || hunts.length === 0) {
        throw new HttpException(
          `Vous n'avez aucune chasse en cours de création`,
          HttpStatus.NOT_FOUND,
        );
      }

      return hunts;
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération des chasses: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, email: string): Promise<Hunt> {
    const hunt = await this.huntRepository.findOne({
      where: {
        id,
        user: { email },
      },
      relations: ['user'],
    });

    if (!hunt) {
      throw new NotFoundException('Chasse non trouvée');
    }

    return hunt;
  }

  async update(
    id: string,
    updateHuntDto: Partial<CreateHuntDto>,
    email: string,
  ): Promise<Hunt> {
    const hunt = await this.findOne(id, email);
    Object.assign(hunt, updateHuntDto);
    return await this.huntRepository.save(hunt);
  }

  async remove(id: string, email: string): Promise<void> {
    const hunt = await this.findOne(id, email);
    await this.huntRepository.remove(hunt);
  }

  async publish(id: string, email: string): Promise<Hunt> {
    const hunt = await this.findOne(id, email);
    hunt.status = 'active';
    return await this.huntRepository.save(hunt);
  }

  async findAllActiveHunts(): Promise<Hunt[]> {
    try {
      const hunts = await this.huntRepository.find({
        where: {
          status: Equal('active'),
        },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });

      return hunts;
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération des chasses actives: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async joinHunt(
    huntId: string,
    userEmail: string,
  ): Promise<HuntParticipation> {
    // Vérifier que la chasse existe et est active
    const hunt = await this.huntRepository.findOne({
      where: { id: huntId, status: 'active' },
      relations: ['participations'],
    });

    if (!hunt) {
      throw new NotFoundException('Chasse non trouvée ou inactive');
    }

    // Vérifier le nombre de participants
    if (hunt.participations.length >= hunt.maxParticipants) {
      throw new BadRequestException('Chasse complète');
    }

    // Trouver l'utilisateur
    const user = await this.usersRepository.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier si l'utilisateur participe déjà
    const existingParticipation =
      await this.huntParticipationRepository.findOne({
        where: { huntId: huntId, userId: user.id }, // Correction ici
      });

    if (existingParticipation) {
      throw new BadRequestException('Vous participez déjà à cette chasse');
    }

    // Créer la participation
    const participation = this.huntParticipationRepository.create({
      huntId: huntId, // Correction ici - s'assurer que huntId est bien défini
      userId: user.id,
      status: 'active',
    });

    const savedParticipation =
      await this.huntParticipationRepository.save(participation);

    // Mettre à jour le compteur de participants
    await this.huntRepository.update(huntId, {
      participants: hunt.participations.length + 1,
    });

    return savedParticipation;
  }

  async getUserParticipations(userEmail: string): Promise<HuntParticipation[]> {
    const user = await this.usersRepository.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return await this.huntParticipationRepository.find({
      where: { userId: user.id },
      relations: ['hunt', 'hunt.user'],
      order: { joinedAt: 'DESC' },
    });
  }

  async leaveHunt(huntId: string, userEmail: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const participation = await this.huntParticipationRepository.findOne({
      where: { huntId: huntId, userId: user.id, status: 'active' }, // Correction ici
    });

    if (!participation) {
      throw new NotFoundException('Participation non trouvée');
    }

    // Supprimer la participation
    await this.huntParticipationRepository.remove(participation);

    // Décrémenter le compteur de participants
    const hunt = await this.huntRepository.findOne({
      where: { id: huntId },
      relations: ['participations'],
    });

    if (hunt) {
      await this.huntRepository.update(huntId, {
        participants: Math.max(0, hunt.participants - 1),
      });
    }
  }
}

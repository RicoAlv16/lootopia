import {
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

@Injectable()
export class HuntsService {
  constructor(
    @InjectRepository(Hunt)
    private huntRepository: Repository<Hunt>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
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
}

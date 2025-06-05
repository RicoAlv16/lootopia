import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Auction } from 'src/shared/entities/auction.entity';
import { Artefact } from 'src/shared/entities/artefact.entity';
import { CreateAuctionDto } from 'src/shared/dto/create-auction.dto';
import { ProfileService } from 'src/modules/profile/profile.service';

@Injectable()
export class AuctionManagementService {
  private readonly logger = new Logger(AuctionManagementService.name);

  constructor(
    @InjectRepository(Auction)
    private auctionRepo: Repository<Auction>,

    @InjectRepository(Artefact)
    private artefactRepo: Repository<Artefact>,

    private profileService: ProfileService,
    private dataSource: DataSource
  ) {}

  async createAuction(userId: number, dto: CreateAuctionDto): Promise<Auction> {
    const artefact = await this.artefactRepo.findOne({
      where: { id: dto.artefactId },
      relations: ['owner'],
    });

    if (!artefact) {
      throw new HttpException('Artéfact introuvable', HttpStatus.NOT_FOUND);
    }

    if (artefact.owner.id !== userId) {
      throw new HttpException('Vous ne possédez pas cet artéfact', HttpStatus.FORBIDDEN);
    }

    if (artefact.isInAuction) {
      throw new HttpException('Cet artéfact est déjà aux enchères', HttpStatus.BAD_REQUEST);
    }

    const now = new Date();
    const end = new Date(now.getTime() + dto.durationInMinutes * 60000);

    const auction = this.auctionRepo.create({
      artefact,
      seller: artefact.owner,
      startingPrice: dto.startingPrice,
      currentBid: 0,
      status: 'active',
      startTime: now,
      endTime: end,
    });

    artefact.isInAuction = true;

    await this.dataSource.transaction(async (manager) => {
      await manager.save(auction);
      await manager.save(artefact);
    });

    return auction;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredAuctions(): Promise<void> {
    this.logger.log('🕒 Vérification des enchères expirées...');

    const now = new Date();
    const expiredAuctions = await this.auctionRepo.find({
      where: {
        endTime: LessThanOrEqual(now),
        status: 'active',
      },
      relations: ['artefact', 'currentBidder', 'seller'],
    });

    for (const auction of expiredAuctions) {
      const artefact = auction.artefact;

      if (auction.currentBidder) {
        // Transfert de propriété
        artefact.owner = auction.currentBidder;
        artefact.obtainedAt = new Date();
        artefact.obtentionMethod = 'enchère';

        // Calcul de la taxe
        const taxRate = 0.05;
        const taxAmount = Math.floor(auction.currentBid * taxRate);
        const payout = auction.currentBid - taxAmount;

        // Créditer le vendeur
        await this.profileService.creditUser(auction.seller.id, payout);

        this.logger.log(`✅ Transfert de propriété : artefact #${artefact.id} → user #${auction.currentBidder.id}`);
        this.logger.log(`💰 Paiement du vendeur : ${payout} couronnes (taxe 5%)`);
      } else {
        // Pas d'offres, suppression de l'enchère
        this.logger.warn(`🗑 Suppression de l’enchère sans offres #${auction.id}`);
        await this.auctionRepo.remove(auction);
        artefact.isInAuction = false;
        await this.artefactRepo.save(artefact);
        continue;
      }

      // Finalisation
      auction.status = 'completed';
      artefact.isInAuction = false;

      await this.dataSource.transaction(async manager => {
        await manager.save(artefact);
        await manager.save(auction);
      });
    }
  }
}
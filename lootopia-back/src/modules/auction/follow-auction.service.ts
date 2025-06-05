import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowedAuction } from 'src/shared/entities/followed-auction.entity';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { Auction } from 'src/shared/entities/auction.entity';

@Injectable()
export class FollowAuctionService {
  constructor(
    @InjectRepository(FollowedAuction)
    private followRepo: Repository<FollowedAuction>,

    @InjectRepository(UsersEntity)
    private userRepo: Repository<UsersEntity>,

    @InjectRepository(Auction)
    private auctionRepo: Repository<Auction>,
  ) {}

  async followAuction(userId: number, auctionId: number): Promise<void> {
    const user = await this.userRepo.findOneBy({ id: userId });
    const auction = await this.auctionRepo.findOneBy({ id: auctionId });

    if (!user || !auction) {
      throw new NotFoundException('Utilisateur ou enchère introuvable');
    }

    const existing = await this.followRepo.findOne({
      where: {
        user: { id: userId },
        auction: { id: auctionId },
      },
    });

    if (!existing) {
      const follow = this.followRepo.create({ user, auction });
      await this.followRepo.save(follow);
    }
  }

  async unfollowAuction(userId: number, auctionId: number): Promise<void> {
    await this.followRepo.delete({
      user: { id: userId },
      auction: { id: auctionId },
    });
  }

  async getFollowedAuctions(userId: number): Promise<Auction[]> {
    const follows = await this.followRepo.find({
      where: { user: { id: userId } },
      relations: ['auction', 'auction.artefact', 'auction.artefact.loot'],
    });

    return follows.map(f => f.auction);
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auction } from 'src/shared/entities/auction.entity';
import { Bid } from 'src/shared/entities/bid.entity';
import { FilterAuctionDto } from 'src/shared/dto/filter-auction.dto';

@Injectable()
export class AuctionQueryService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepo: Repository<Auction>,

    @InjectRepository(Bid)
    private bidRepo: Repository<Bid>,
  ) {}

  async getFilteredAuctions(filter: FilterAuctionDto): Promise<Auction[]> {
    const query = this.auctionRepo
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.artefact', 'artefact')
      .leftJoinAndSelect('artefact.loot', 'loot')
      .where('auction.status = :status', { status: 'active' });

    if (filter.name) {
      query.andWhere('LOWER(artefact.name) LIKE :name', {
        name: `%${filter.name.toLowerCase()}%`,
      });
    }

    if (filter.minPrice !== undefined) {
      query.andWhere('auction.currentBid >= :minPrice', { minPrice: filter.minPrice });
    }

    if (filter.maxPrice !== undefined) {
      query.andWhere('auction.currentBid <= :maxPrice', { maxPrice: filter.maxPrice });
    }

    if (filter.rarity) {
      query.andWhere('artefact.rarity = :rarity', { rarity: filter.rarity });
    }

    return query.getMany();
  }

  async getMyAuctions(userId: number): Promise<Auction[]> {
    return this.auctionRepo.find({
      where: { seller: { id: userId } },
      relations: ['artefact'],
      order: { endTime: 'DESC' },
    });
  }

  async getFollowedAuctions(userId: number): Promise<Auction[]> {
    const bids = await this.bidRepo.find({
      where: { bidder: { id: userId } },
      relations: ['auction', 'auction.artefact'],
    });

    const uniqueAuctions = new Map<number, Auction>();
    bids.forEach(bid => {
      if (bid.auction) {
        uniqueAuctions.set(bid.auction.id, bid.auction);
      }
    });

    return Array.from(uniqueAuctions.values());
  }
}
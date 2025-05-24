import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';


import { Auction } from 'src/shared/entities/auction.entity';
import { Bid } from 'src/shared/entities/bid.entity';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { PlaceBidDto } from 'src/shared/dto/place-bid.dto';
import { ProfileService } from 'src/modules/profile/profile.service';
import { CreateAuctionDto } from 'src/shared/dto/create-auction.dto';
import { FilterAuctionDto } from 'src/shared/dto/filter-auction.dto';
import { Artefact } from 'src/shared/entities/artefact.entity';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepo: Repository<Auction>,

    @InjectRepository(Bid)
    private bidRepo: Repository<Bid>,

    @InjectRepository(UsersEntity)
    private userRepo: Repository<UsersEntity>,

    private profileService: ProfileService,

    private dataSource: DataSource
  ) {}

  async placeBid(userId: number, dto: PlaceBidDto): Promise<Bid> {
    const auction = await this.auctionRepo.findOne({
      where: { id: dto.auctionId },
      relations: ['currentBidder', 'seller'],
    });

    if (!auction || auction.status !== 'active') {
      throw new HttpException('Enchère invalide ou expirée', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    const profile = user?.profile?.[0];

    if (!user || !profile) {
      throw new HttpException('Utilisateur ou profil introuvable', HttpStatus.NOT_FOUND);
    }

    if (dto.amount <= auction.currentBid) {
      throw new HttpException('Montant trop bas', HttpStatus.BAD_REQUEST);
    }

    if (profile.balance < dto.amount) {
      throw new HttpException('Solde insuffisant', HttpStatus.BAD_REQUEST);
    }

    if (auction.currentBidder) {
      await this.profileService.creditUser(auction.currentBidder.id, auction.currentBid);
    }

    await this.profileService.debitUser(user.id, dto.amount);

    const bid = this.bidRepo.create({
      auction,
      bidder: user,
      amount: dto.amount,
      timestamp: new Date(),
    });

    await this.bidRepo.save(bid);

    auction.currentBid = dto.amount;
    auction.currentBidder = user;
    await this.auctionRepo.save(auction);

    return bid;
  }

  async createAuction(userId: number, dto: CreateAuctionDto): Promise<Auction> {
    const artefact = await this.dataSource.getRepository(Artefact).findOne({
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

  async getFilteredAuctions(filter: FilterAuctionDto): Promise<Auction[]> {
    const query = this.auctionRepo
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.artefact', 'artefact')
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

}
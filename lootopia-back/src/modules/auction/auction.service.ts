import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auction } from 'src/shared/entities/auction.entity';
import { Bid } from 'src/shared/entities/bid.entity';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { PlaceBidDto } from 'src/shared/dto/place-bid.dto';
import { ProfileService } from 'src/modules/profile/profile.service';

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
}
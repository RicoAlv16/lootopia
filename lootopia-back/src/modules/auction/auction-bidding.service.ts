import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from 'src/shared/entities/auction.entity';
import { Bid } from 'src/shared/entities/bid.entity';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { PlaceBidDto } from 'src/shared/dto/place-bid.dto';
import { ProfileService } from 'src/modules/profile/profile.service';
import { FollowedAuction } from 'src/shared/entities/followed-auction.entity';

@Injectable()
export class AuctionBiddingService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepo: Repository<Auction>,

    @InjectRepository(Bid)
    private bidRepo: Repository<Bid>,

    @InjectRepository(UsersEntity)
    private userRepo: Repository<UsersEntity>,

    @InjectRepository(FollowedAuction)
    private followRepo: Repository<FollowedAuction>,

    private profileService: ProfileService
  ) {}

  async placeBid(userId: number, dto: PlaceBidDto): Promise<Bid> {
    console.log(`📨 Tentative d'enchère utilisateur=${userId}, auctionId=${dto.auctionId}, montant=${dto.amount}`);

    const auction = await this.auctionRepo.findOne({
      where: { id: dto.auctionId },
      relations: ['currentBidder', 'seller'],
    });

    if (!auction || auction.status !== 'active') {
      console.log('❌ Enchère invalide ou expirée');
      throw new HttpException('Enchère invalide ou expirée', HttpStatus.BAD_REQUEST);
    }

    if (auction.seller.id === userId) {
      console.log('❌ Tentative d\'enchère sur sa propre enchère');
      throw new HttpException("Vous ne pouvez pas enchérir sur votre propre enchère", HttpStatus.BAD_REQUEST);
    }

    if (auction.currentBidder?.id === userId) {
      console.log('❌ Utilisateur est déjà le meilleur enchérisseur');
      throw new HttpException("Vous êtes déjà le meilleur enchérisseur", HttpStatus.BAD_REQUEST);
    }

    const hasBid = auction.currentBid > 0;

    if (
      (hasBid && dto.amount <= auction.currentBid) ||
      (!hasBid && dto.amount < auction.startingPrice)
    ) {
      const minimumRequired = hasBid ? auction.currentBid + 1 : auction.startingPrice;
      console.log(`❌ Montant proposé (${dto.amount}) insuffisant, requis: ${minimumRequired}`);
      throw new HttpException(
        `L'enchère doit être au moins de ${minimumRequired} couronnes`,
        HttpStatus.BAD_REQUEST
      );
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    const profile = user?.profile?.[0];

    if (!user || !profile) {
      console.log('❌ Utilisateur ou profil introuvable');
      throw new HttpException('Utilisateur ou profil introuvable', HttpStatus.NOT_FOUND);
    }

    if (profile.balance < dto.amount) {
      console.log(`❌ Solde insuffisant : balance=${profile.balance}, demandé=${dto.amount}`);
      throw new HttpException('Solde insuffisant', HttpStatus.BAD_REQUEST);
    }

    if (auction.endTime <= new Date()) {
      console.log('❌ Enchère expirée (date atteinte)');
      throw new HttpException('Enchère expirée', HttpStatus.BAD_REQUEST);
    }

    // Remboursement ancien enchérisseur
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

    const alreadyFollowed = await this.followRepo.findOne({
      where: { user: { id: user.id }, auction: { id: auction.id } },
    });

    if (!alreadyFollowed) {
      const follow = this.followRepo.create({ user, auction });
      await this.followRepo.save(follow);
      console.log('⭐ Enchère ajoutée aux suivies automatiquement');
    }

    console.log('✅ Enchère placée avec succès');
    return bid;
  }

}
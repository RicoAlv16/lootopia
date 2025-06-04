import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from 'src/shared/entities/auction.entity';
import { Artefact } from 'src/shared/entities/artefact.entity';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { Bid } from 'src/shared/entities/bid.entity';
import { FollowedAuction } from 'src/shared/entities/followed-auction.entity';

import { AuctionController } from './auction.controller';
import { FollowAuctionController } from './follow-auction.controller';

import { AuctionBiddingService } from './auction-bidding.service';
import { AuctionManagementService } from './auction-management.service';
import { AuctionQueryService } from './auction-query.service';
import { FollowAuctionService } from './follow-auction.service';

import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, Artefact, UsersEntity, Bid, FollowedAuction]),
    ProfileModule,
  ],
  controllers: [
    AuctionController, 
    FollowAuctionController,
  ],

  providers: [
    AuctionBiddingService,
    AuctionManagementService,
    AuctionQueryService,
    FollowAuctionService,
  ],
  exports: [
    AuctionBiddingService,
    AuctionManagementService,
    AuctionQueryService,
    FollowAuctionService,
  ],
})
export class AuctionModule {}
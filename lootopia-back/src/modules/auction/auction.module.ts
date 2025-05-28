import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from 'src/shared/entities/auction.entity';
import { Artefact } from 'src/shared/entities/artefact.entity';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { Bid } from 'src/shared/entities/bid.entity';

import { AuctionController } from './auction.controller';

import { AuctionBiddingService } from './auction-bidding.service';
import { AuctionManagementService } from './auction-management.service';
import { AuctionQueryService } from './auction-query.service';

import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, Artefact, UsersEntity, Bid]),
    ProfileModule,
  ],
  controllers: [AuctionController],
  providers: [
    AuctionBiddingService,
    AuctionManagementService,
    AuctionQueryService,
  ],
  exports: [
    AuctionBiddingService,
    AuctionManagementService,
    AuctionQueryService,
  ],
})
export class AuctionModule {}
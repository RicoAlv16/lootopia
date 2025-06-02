import { Body, Controller, Post, Get, Query } from '@nestjs/common';

import { CreateAuctionDto } from 'src/shared/dto/create-auction.dto';
import { FilterAuctionDto } from 'src/shared/dto/filter-auction.dto';
import { PlaceBidDto } from 'src/shared/dto/place-bid.dto';

import { AuctionBiddingService } from './auction-bidding.service';
import { AuctionManagementService } from './auction-management.service';
import { AuctionQueryService } from './auction-query.service';

@Controller('auction')
export class AuctionController {
  constructor(
    private readonly biddingService: AuctionBiddingService,
    private readonly managementService: AuctionManagementService,
    private readonly queryService: AuctionQueryService,
  ) {}

  @Post('create')
  async createAuction(@Body() dto: CreateAuctionDto & { userId: number }) {
    return this.managementService.createAuction(dto.userId, dto);
  }

  @Post('bid')
  async placeBid(@Body() dto: PlaceBidDto & { userId: number }) {
    return this.biddingService.placeBid(dto.userId, dto);
  }

  @Get('list')
  async listAuctions(@Query() filter: FilterAuctionDto) {
    return this.queryService.getFilteredAuctions(filter);
  }

  @Get('my')
  async getMyAuctions(@Query('userId') userId: number) {
    return this.queryService.getMyAuctions(userId);
  }

  @Get('followed')
  async getFollowedAuctions(@Query('userId') userId: number) {
    return this.queryService.getFollowedAuctions(userId);
  }
}
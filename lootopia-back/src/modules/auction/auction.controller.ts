import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { CreateAuctionDto } from 'src/shared/dto/create-auction.dto';
import { FilterAuctionDto } from 'src/shared/dto/filter-auction.dto';
import { PlaceBidDto } from 'src/shared/dto/place-bid.dto';

import { AuctionBiddingService } from './auction-bidding.service';
import { AuctionManagementService } from './auction-management.service';
import { AuctionQueryService } from './auction-query.service';

@UseGuards(AuthGuard('jwt'))
@Controller('auction')
export class AuctionController {
  constructor(
    private readonly biddingService: AuctionBiddingService,
    private readonly managementService: AuctionManagementService,
    private readonly queryService: AuctionQueryService,
  ) {}

  @Post('create')
  async createAuction(@Req() req: Request, @Body() dto: CreateAuctionDto) {
    const userId = req.user['userId'];
    return this.managementService.createAuction(userId, dto);
  }

  @Post('bid')
  async placeBid(@Body() dto: PlaceBidDto, @Req() req: Request) {
    const userId = req.user['userId'];
    return this.biddingService.placeBid(userId, dto);
  }

  @Get('list')
  async listAuctions(@Query() filter: FilterAuctionDto) {
    return this.queryService.getFilteredAuctions(filter);
  }

  @Get('my')
  async getMyAuctions(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.queryService.getMyAuctions(userId);
  }

  @Get('followed')
  async getFollowedAuctions(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.queryService.getFollowedAuctions(userId);
  }
}
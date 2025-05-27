import { Body, Controller, Post } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from 'src/shared/dto/create-auction.dto';
import { FilterAuctionDto } from 'src/shared/dto/filter-auction.dto';
import { Get, Query } from '@nestjs/common';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post('create')
  async createAuction(@Body() dto: CreateAuctionDto & { userId: number }) {
    // userId temporairement passé dans le corps de la requête
    return this.auctionService.createAuction(dto.userId, dto);
  }

  @Get('list')
  async listAuctions(@Query() filter: FilterAuctionDto) {
    return this.auctionService.getFilteredAuctions(filter);
  }

  @Get('my')
  async getMyAuctions(@Query('userId') userId: number) {
    return this.auctionService.getMyAuctions(userId);
  }

  @Get('followed')
  async getFollowedAuctions(@Query('userId') userId: number) {
    return this.auctionService.getFollowedAuctions(userId);
  }

}

import { Body, Controller, Post } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from 'src/shared/dto/create-auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post('create')
  async createAuction(@Body() dto: CreateAuctionDto & { userId: number }) {
    // userId temporairement passé dans le corps de la requête
    return this.auctionService.createAuction(dto.userId, dto);
  }
}

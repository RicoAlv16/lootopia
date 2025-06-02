import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { FollowAuctionService } from './follow-auction.service';

@Controller('follow-auction')
export class FollowAuctionController {
  constructor(private readonly auctionService: FollowAuctionService) {}

  @Post('follow')
  follow(@Body() body: { userId: number; auctionId: number }) {
    return this.auctionService.followAuction(body.userId, body.auctionId);
  }

  @Delete('unfollow')
  unfollow(
    @Query('userId') userId: number,
    @Query('auctionId') auctionId: number,
  ) {
    return this.auctionService.unfollowAuction(userId, auctionId);
  }

  @Get('followed')
  getFollowed(@Query('userId') userId: number) {
    return this.auctionService.getFollowedAuctions(userId);
  }
}

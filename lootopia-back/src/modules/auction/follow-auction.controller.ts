import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FollowAuctionService } from './follow-auction.service';

@UseGuards(AuthGuard('jwt'))
@Controller('follow-auction')
export class FollowAuctionController {
  constructor(private readonly auctionService: FollowAuctionService) {}

  @Post('follow')
  follow(@Req() req: Request, @Body() body: { auctionId: number }) {
    const userId = req.user['userId'];
    return this.auctionService.followAuction(userId, body.auctionId);
  }

  @Delete('unfollow/:auctionId')
  unfollow(@Req() req: Request) {
    const userId = req.user['userId'];
    const auctionId = parseInt(req.params['auctionId'], 10);
    return this.auctionService.unfollowAuction(userId, auctionId);
  }

  @Get('followed')
  getFollowed(@Req() req: Request) {
    const userId = req.user['userId'];
    return this.auctionService.getFollowedAuctions(userId);
  }
}
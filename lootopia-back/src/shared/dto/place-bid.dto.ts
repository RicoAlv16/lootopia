import { IsNumber, Min } from 'class-validator';

export class PlaceBidDto {
  @IsNumber()
  auctionId: number;

  @IsNumber()
  @Min(1)
  amount: number;
}
import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuctionDto {
  @ApiProperty()
  @IsInt()
  artefactId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  startingPrice: number;

  @ApiProperty()
  @IsInt()
  durationInMinutes: number;
}
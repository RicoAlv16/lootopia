export class FilterAuctionDto {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  rarity?: 'COMMUN' | 'RARE' | 'ÉPIQUE' | 'LÉGENDAIRE';
}
import { Test, TestingModule } from '@nestjs/testing';
import { AuctionQueryService } from './auction-query.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from 'src/shared/entities/auction.entity';
import { Bid } from 'src/shared/entities/bid.entity';
import { FilterAuctionDto } from 'src/shared/dto/filter-auction.dto';

describe('AuctionQueryService', () => {
  let service: AuctionQueryService;
  let auctionRepo: Repository<Auction>;
  let bidRepo: Repository<Bid>;

  const mockAuctionRepo = {
    createQueryBuilder: jest.fn(),
    find: jest.fn()
  };

  const mockBidRepo = {
    find: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionQueryService,
        { provide: getRepositoryToken(Auction), useValue: mockAuctionRepo },
        { provide: getRepositoryToken(Bid), useValue: mockBidRepo }
      ]
    }).compile();

    service = module.get<AuctionQueryService>(AuctionQueryService);
    auctionRepo = module.get(getRepositoryToken(Auction));
    bidRepo = module.get(getRepositoryToken(Bid));
  });

  afterEach(() => jest.clearAllMocks());

  describe('getFilteredAuctions', () => {
    it('should return auctions with all filters applied', async () => {
      const mockQuery = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1 }]),
      };

      mockAuctionRepo.createQueryBuilder.mockReturnValue(mockQuery);

      const filter: FilterAuctionDto = {
        name: 'sword',
        minPrice: 100,
        maxPrice: 300,
        rarity: 'RARE'
      };

      const result = await service.getFilteredAuctions(filter);
      expect(result).toEqual([{ id: 1 }]);
      expect(mockQuery.getMany).toHaveBeenCalled();
    });
  });

  describe('getMyAuctions', () => {
    it('should return user auctions sorted by endTime DESC', async () => {
      const expected = [{ id: 1 }];
      mockAuctionRepo.find.mockResolvedValue(expected);

      const result = await service.getMyAuctions(42);
      expect(result).toEqual(expected);
      expect(mockAuctionRepo.find).toHaveBeenCalledWith({
        where: { seller: { id: 42 } },
        relations: ['artefact'],
        order: { endTime: 'DESC' },
      });
    });
  });

  describe('getFollowedAuctions', () => {
    it('should return unique auctions followed by user based on bids', async () => {
      const auction = { id: 1, artefact: {} };
      const bid = { auction };
      mockBidRepo.find.mockResolvedValue([bid]);

      const result = await service.getFollowedAuctions(5);
      expect(result).toEqual([auction]);
      expect(mockBidRepo.find).toHaveBeenCalledWith({
        where: { bidder: { id: 5 } },
        relations: ['auction', 'auction.artefact'],
      });
    });
  });
});

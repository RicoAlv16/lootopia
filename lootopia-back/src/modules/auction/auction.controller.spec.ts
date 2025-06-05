import { Test, TestingModule } from '@nestjs/testing';
import { AuctionController } from './auction.controller';
import { AuctionBiddingService } from './auction-bidding.service';
import { AuctionManagementService } from './auction-management.service';
import { AuctionQueryService } from './auction-query.service';
import { CreateAuctionDto } from 'src/shared/dto/create-auction.dto';
import { PlaceBidDto } from 'src/shared/dto/place-bid.dto';
import { FilterAuctionDto } from 'src/shared/dto/filter-auction.dto';

describe('AuctionController', () => {
  let controller: AuctionController;
  let biddingService: AuctionBiddingService;
  let managementService: AuctionManagementService;
  let queryService: AuctionQueryService;

  const mockBiddingService = {
    placeBid: jest.fn(),
  };

  const mockManagementService = {
    createAuction: jest.fn(),
  };

  const mockQueryService = {
    getFilteredAuctions: jest.fn(),
    getMyAuctions: jest.fn(),
    getFollowedAuctions: jest.fn(),
  };

  const mockRequest = {
    user: { userId: 42 },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuctionController],
      providers: [
        { provide: AuctionBiddingService, useValue: mockBiddingService },
        { provide: AuctionManagementService, useValue: mockManagementService },
        { provide: AuctionQueryService, useValue: mockQueryService },
      ],
    }).compile();

    controller = module.get<AuctionController>(AuctionController);
    biddingService = module.get(AuctionBiddingService);
    managementService = module.get(AuctionManagementService);
    queryService = module.get(AuctionQueryService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should call createAuction on managementService', async () => {
    const dto: CreateAuctionDto = {
      artefactId: 1,
      startingPrice: 100,
      durationInMinutes: 60,
    };
    await controller.createAuction(mockRequest, dto);
    expect(managementService.createAuction).toHaveBeenCalledWith(42, dto);
  });

  it('should call placeBid on biddingService', async () => {
    const dto: PlaceBidDto = { auctionId: 1, amount: 200 };
    await controller.placeBid(dto, mockRequest);
    expect(biddingService.placeBid).toHaveBeenCalledWith(42, dto);
  });

  it('should call getFilteredAuctions on queryService', async () => {
    const filter: FilterAuctionDto = { name: 'sword' };
    await controller.listAuctions(filter);
    expect(queryService.getFilteredAuctions).toHaveBeenCalledWith(filter);
  });

  it('should call getMyAuctions on queryService', async () => {
    await controller.getMyAuctions(mockRequest);
    expect(queryService.getMyAuctions).toHaveBeenCalledWith(42);
  });

  it('should call getFollowedAuctions on queryService', async () => {
    await controller.getFollowedAuctions(mockRequest);
    expect(queryService.getFollowedAuctions).toHaveBeenCalledWith(42);
  });
});

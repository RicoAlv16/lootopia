import { Test, TestingModule } from '@nestjs/testing';
import { FollowAuctionController } from './follow-auction.controller';
import { FollowAuctionService } from './follow-auction.service';

describe('FollowAuctionController', () => {
  let controller: FollowAuctionController;
  let service: FollowAuctionService;

  const mockService = {
    followAuction: jest.fn(),
    unfollowAuction: jest.fn(),
    getFollowedAuctions: jest.fn(),
  };

  const mockRequest = {
    user: { userId: 42 },
    params: { auctionId: '123' },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowAuctionController],
      providers: [{ provide: FollowAuctionService, useValue: mockService }],
    }).compile();

    controller = module.get<FollowAuctionController>(FollowAuctionController);
    service = module.get<FollowAuctionService>(FollowAuctionService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should call followAuction with userId and auctionId', () => {
    const body = { auctionId: 100 };
    controller.follow(mockRequest, body);
    expect(service.followAuction).toHaveBeenCalledWith(42, 100);
  });

  it('should call unfollowAuction with parsed auctionId and userId', () => {
    controller.unfollow(mockRequest);
    expect(service.unfollowAuction).toHaveBeenCalledWith(42, 123);
  });

  it('should call getFollowedAuctions with userId', () => {
    controller.getFollowed(mockRequest);
    expect(service.getFollowedAuctions).toHaveBeenCalledWith(42);
  });
});

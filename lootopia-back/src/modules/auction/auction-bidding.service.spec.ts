import { Test, TestingModule } from '@nestjs/testing';
import { AuctionBiddingService } from './auction-bidding.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auction } from 'src/shared/entities/auction.entity';
import { Bid } from 'src/shared/entities/bid.entity';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { FollowedAuction } from 'src/shared/entities/followed-auction.entity';
import { Repository } from 'typeorm';
import { ProfileService } from 'src/modules/profile/profile.service';
import { PlaceBidDto } from 'src/shared/dto/place-bid.dto';
import { HttpException } from '@nestjs/common';

describe('AuctionBiddingService', () => {
  let service: AuctionBiddingService;
  let auctionRepo: Repository<Auction>;
  let bidRepo: Repository<Bid>;
  let userRepo: Repository<UsersEntity>;
  let followRepo: Repository<FollowedAuction>;
  let profileService: ProfileService;

  const mockAuctionRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockBidRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  const mockFollowRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProfileService = {
    creditUser: jest.fn(),
    debitUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionBiddingService,
        { provide: getRepositoryToken(Auction), useValue: mockAuctionRepo },
        { provide: getRepositoryToken(Bid), useValue: mockBidRepo },
        { provide: getRepositoryToken(UsersEntity), useValue: mockUserRepo },
        { provide: getRepositoryToken(FollowedAuction), useValue: mockFollowRepo },
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    service = module.get<AuctionBiddingService>(AuctionBiddingService);
    auctionRepo = module.get(getRepositoryToken(Auction));
    bidRepo = module.get(getRepositoryToken(Bid));
    userRepo = module.get(getRepositoryToken(UsersEntity));
    followRepo = module.get(getRepositoryToken(FollowedAuction));
    profileService = module.get(ProfileService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw if auction not found or inactive', async () => {
    mockAuctionRepo.findOne.mockResolvedValue(null);

    await expect(
      service.placeBid(1, { auctionId: 999, amount: 100 })
    ).rejects.toThrow(HttpException);
  });

  it('should throw if user is seller', async () => {
    mockAuctionRepo.findOne.mockResolvedValue({
      id: 1,
      status: 'active',
      seller: { id: 1 },
    });

    await expect(
      service.placeBid(1, { auctionId: 1, amount: 100 })
    ).rejects.toThrow(/propre enchère/);
  });

  it('should throw if user is already highest bidder', async () => {
    mockAuctionRepo.findOne.mockResolvedValue({
      id: 1,
      status: 'active',
      seller: { id: 2 },
      currentBidder: { id: 1 },
    });

    await expect(
      service.placeBid(1, { auctionId: 1, amount: 120 })
    ).rejects.toThrow(/meilleur enchérisseur/);
  });

  it('should throw if amount too low', async () => {
    mockAuctionRepo.findOne.mockResolvedValue({
      id: 1,
      status: 'active',
      seller: { id: 2 },
      currentBidder: { id: 3 },
      currentBid: 150,
    });

    await expect(
      service.placeBid(1, { auctionId: 1, amount: 100 })
    ).rejects.toThrow(/doit être au moins de/);
  });

  it('should throw if profile or balance invalid', async () => {
    mockAuctionRepo.findOne.mockResolvedValue({
      id: 1,
      status: 'active',
      seller: { id: 2 },
      currentBid: 0,
    });

    mockUserRepo.findOne.mockResolvedValue(null);

    await expect(
      service.placeBid(1, { auctionId: 1, amount: 100 })
    ).rejects.toThrow(/profil introuvable/);
  });

  it('should throw if auction is expired', async () => {
    mockAuctionRepo.findOne.mockResolvedValue({
      id: 1,
      status: 'active',
      seller: { id: 2 },
      endTime: new Date(Date.now() - 10000),
      currentBid: 0,
    });

    mockUserRepo.findOne.mockResolvedValue({ id: 1, profile: [{}] });

    await expect(
      service.placeBid(1, { auctionId: 1, amount: 100 })
    ).rejects.toThrow(/Enchère expirée/);
  });

  it('should place bid successfully', async () => {
    const auction = {
      id: 1,
      status: 'active',
      seller: { id: 2 },
      currentBid: 0,
      endTime: new Date(Date.now() + 10000),
    };

    const user = {
      id: 1,
      profile: [{ balance: 1000 }],
    };

    const bid = { id: 1, amount: 100 };

    mockAuctionRepo.findOne.mockResolvedValue(auction);
    mockUserRepo.findOne.mockResolvedValue(user);
    mockBidRepo.create.mockReturnValue(bid);
    mockFollowRepo.findOne.mockResolvedValue(null);
    mockBidRepo.save.mockResolvedValue(bid);
    mockAuctionRepo.save.mockResolvedValue({});
    mockFollowRepo.save.mockResolvedValue({});

    const result = await service.placeBid(1, { auctionId: 1, amount: 100 });

    expect(result).toBe(bid);
    expect(mockProfileService.debitUser).toHaveBeenCalledWith(1, 100);
    expect(mockFollowRepo.save).toHaveBeenCalled();
    expect(mockAuctionRepo.save).toHaveBeenCalled();
  });
});

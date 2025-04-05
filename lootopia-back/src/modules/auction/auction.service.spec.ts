import { Test, TestingModule } from '@nestjs/testing';
import { AuctionService } from './auction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auction } from 'src/shared/entities/auction.entity';
import { Bid } from 'src/shared/entities/bid.entity';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { ProfileService } from 'src/modules/profile/profile.service';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PlaceBidDto } from 'src/shared/dto/place-bid.dto';

describe('AuctionService', () => {
  let service: AuctionService;
  let auctionRepo: Repository<Auction>;
  let bidRepo: Repository<Bid>;
  let userRepo: Repository<UsersEntity>;
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

  const mockProfileService = {
    debitUser: jest.fn(),
    creditUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionService,
        { provide: getRepositoryToken(Auction), useValue: mockAuctionRepo },
        { provide: getRepositoryToken(Bid), useValue: mockBidRepo },
        { provide: getRepositoryToken(UsersEntity), useValue: mockUserRepo },
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    service = module.get<AuctionService>(AuctionService);
    auctionRepo = module.get(getRepositoryToken(Auction));
    bidRepo = module.get(getRepositoryToken(Bid));
    userRepo = module.get(getRepositoryToken(UsersEntity));
    profileService = module.get(ProfileService);
  });

  it('devrait créer une enchère valide', async () => {
    const userId = 1;
    const dto: PlaceBidDto = {
      auctionId: 1,
      amount: 200,
    };

    const mockAuction = {
      id: 1,
      status: 'active',
      currentBid: 100,
      currentBidder: { id: 2 },
      seller: {},
    };

    const mockUser = {
      id: 1,
      profile: [{ balance: 500 }],
    };

    const mockBid = {
      id: 10,
      amount: 200,
      auction: mockAuction,
      bidder: mockUser,
      timestamp: new Date(),
    };

    mockAuctionRepo.findOne.mockResolvedValue(mockAuction);
    mockUserRepo.findOne.mockResolvedValue(mockUser);
    mockBidRepo.create.mockReturnValue(mockBid);
    mockBidRepo.save.mockResolvedValue(mockBid);
    mockAuctionRepo.save.mockResolvedValue({ ...mockAuction, currentBid: 200, currentBidder: mockUser });

    const result = await service.placeBid(userId, dto);

    expect(profileService.creditUser).toHaveBeenCalledWith(2, 100);
    expect(profileService.debitUser).toHaveBeenCalledWith(1, 200);
    expect(mockBidRepo.save).toHaveBeenCalledWith(mockBid);
    expect(mockAuctionRepo.save).toHaveBeenCalled();
    expect(result).toEqual(mockBid);
  });

  it('devrait échouer si l\'enchère est introuvable ou inactive', async () => {
    mockAuctionRepo.findOne.mockResolvedValue(null);

    await expect(service.placeBid(1, { auctionId: 99, amount: 100 }))
      .rejects
      .toThrow(new HttpException('Enchère invalide ou expirée', HttpStatus.BAD_REQUEST));
  });

  it('devrait échouer si le montant est inférieur ou égal à l\'offre actuelle', async () => {
    const mockAuction = {
      id: 1,
      status: 'active',
      currentBid: 150,
    };

    mockAuctionRepo.findOne.mockResolvedValue(mockAuction);

    await expect(service.placeBid(1, { auctionId: 1, amount: 100 }))
      .rejects
      .toThrow(new HttpException('Montant trop bas', HttpStatus.BAD_REQUEST));
  });

  it('devrait échouer si le solde est insuffisant', async () => {
    const mockAuction = {
      id: 1,
      status: 'active',
      currentBid: 100,
    };

    const mockUser = {
      id: 1,
      profile: [{ balance: 50 }],
    };

    mockAuctionRepo.findOne.mockResolvedValue(mockAuction);
    mockUserRepo.findOne.mockResolvedValue(mockUser);

    await expect(service.placeBid(1, { auctionId: 1, amount: 200 }))
      .rejects
      .toThrow(new HttpException('Solde insuffisant', HttpStatus.BAD_REQUEST));
  });

  it('devrait échouer si l\'utilisateur ou le profil est introuvable', async () => {
    const mockAuction = {
      id: 1,
      status: 'active',
      currentBid: 100,
    };

    mockAuctionRepo.findOne.mockResolvedValue(mockAuction);
    mockUserRepo.findOne.mockResolvedValue(null);

    await expect(service.placeBid(1, { auctionId: 1, amount: 200 }))
      .rejects
      .toThrow(new HttpException('Utilisateur ou profil introuvable', HttpStatus.NOT_FOUND));
  });
});

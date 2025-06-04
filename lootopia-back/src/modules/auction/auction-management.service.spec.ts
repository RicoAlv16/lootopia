import { Test, TestingModule } from '@nestjs/testing';
import { AuctionManagementService } from './auction-management.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Auction } from 'src/shared/entities/auction.entity';
import { Artefact } from 'src/shared/entities/artefact.entity';
import { ProfileService } from 'src/modules/profile/profile.service';
import { CreateAuctionDto } from 'src/shared/dto/create-auction.dto';
import { HttpException } from '@nestjs/common';

describe('AuctionManagementService', () => {
  let service: AuctionManagementService;
  let artefactRepo: Repository<Artefact>;
  let auctionRepo: Repository<Auction>;
  let profileService: ProfileService;
  let dataSource: DataSource;

  const mockArtefactRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockAuctionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockProfileService = {
    creditUser: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn().mockImplementation(async (cb) => await cb({ save: jest.fn() })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionManagementService,
        { provide: getRepositoryToken(Auction), useValue: mockAuctionRepo },
        { provide: getRepositoryToken(Artefact), useValue: mockArtefactRepo },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<AuctionManagementService>(AuctionManagementService);
    artefactRepo = module.get(getRepositoryToken(Artefact));
    auctionRepo = module.get(getRepositoryToken(Auction));
    profileService = module.get(ProfileService);
    dataSource = module.get(DataSource);
  });

  afterEach(() => jest.clearAllMocks());

  describe('createAuction', () => {
    it('should throw if artefact not found', async () => {
      mockArtefactRepo.findOne.mockResolvedValue(null);

      await expect(
        service.createAuction(1, { artefactId: 1, startingPrice: 100, durationInMinutes: 60 })
      ).rejects.toThrow(HttpException);
    });

    it('should throw if artefact not owned by user', async () => {
      mockArtefactRepo.findOne.mockResolvedValue({ id: 1, owner: { id: 2 } });

      await expect(
        service.createAuction(1, { artefactId: 1, startingPrice: 100, durationInMinutes: 60 })
      ).rejects.toThrow(/possédez pas/);
    });

    it('should throw if artefact is already in auction', async () => {
      mockArtefactRepo.findOne.mockResolvedValue({
        id: 1,
        owner: { id: 1 },
        isInAuction: true,
      });

      await expect(
        service.createAuction(1, { artefactId: 1, startingPrice: 100, durationInMinutes: 60 })
      ).rejects.toThrow(/déjà aux enchères/);
    });

    it('should create and save auction', async () => {
      const artefact = {
        id: 1,
        owner: { id: 1 },
        isInAuction: false,
      };

      const auction = { id: 999, artefact };

      mockArtefactRepo.findOne.mockResolvedValue(artefact);
      mockAuctionRepo.create.mockReturnValue(auction);

      await expect(
        service.createAuction(1, { artefactId: 1, startingPrice: 100, durationInMinutes: 60 })
      ).resolves.toEqual(auction);

      expect(mockAuctionRepo.create).toHaveBeenCalled();
      expect(mockArtefactRepo.findOne).toHaveBeenCalled();
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });
  });

  describe('handleExpiredAuctions', () => {
    it('should handle auction with no bid', async () => {
      const artefact = { id: 1, isInAuction: true };
      const auction = { id: 1, endTime: new Date(), status: 'active', artefact, currentBidder: null };

      mockAuctionRepo.find.mockResolvedValue([auction]);

      await service.handleExpiredAuctions();

      expect(mockAuctionRepo.remove).toHaveBeenCalledWith(auction);
      expect(mockArtefactRepo.save).toHaveBeenCalledWith(expect.objectContaining({ isInAuction: false }));
    });

    it('should transfer artefact and credit seller if bid exists', async () => {
      const artefact = { id: 1, isInAuction: true };
      const auction = {
        id: 1,
        endTime: new Date(),
        status: 'active',
        artefact,
        currentBid: 200,
        currentBidder: { id: 2 },
        seller: { id: 1 },
      };

      mockAuctionRepo.find.mockResolvedValue([auction]);

      await service.handleExpiredAuctions();

      expect(profileService.creditUser).toHaveBeenCalledWith(1, 190); // 5% tax
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });
  });
});

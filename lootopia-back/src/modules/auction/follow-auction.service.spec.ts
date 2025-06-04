import { Test, TestingModule } from '@nestjs/testing';
import { FollowAuctionService } from './follow-auction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FollowedAuction } from 'src/shared/entities/followed-auction.entity';
import { UsersEntity } from 'src/shared/entities/users.entity';
import { Auction } from 'src/shared/entities/auction.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('FollowAuctionService', () => {
  let service: FollowAuctionService;
  let followRepo: jest.Mocked<Repository<FollowedAuction>>;
  let userRepo: jest.Mocked<Repository<UsersEntity>>;
  let auctionRepo: jest.Mocked<Repository<Auction>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowAuctionService,
        { provide: getRepositoryToken(FollowedAuction), useValue: createMockRepo() },
        { provide: getRepositoryToken(UsersEntity), useValue: createMockRepo() },
        { provide: getRepositoryToken(Auction), useValue: createMockRepo() },
      ],
    }).compile();

    service = module.get(FollowAuctionService);
    followRepo = module.get(getRepositoryToken(FollowedAuction));
    userRepo = module.get(getRepositoryToken(UsersEntity));
    auctionRepo = module.get(getRepositoryToken(Auction));
  });

  function createMockRepo() {
    return {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<any>>;
  }

  it('should follow an auction if not already followed', async () => {
    const mockUser = { id: 1 };
    const mockAuction = { id: 2 };

    userRepo.findOneBy.mockResolvedValue(mockUser as any);
    auctionRepo.findOneBy.mockResolvedValue(mockAuction as any);
    followRepo.findOne.mockResolvedValue(null);
    followRepo.create.mockReturnValue({ user: mockUser, auction: mockAuction } as any);

    await service.followAuction(1, 2);

    expect(followRepo.save).toHaveBeenCalledWith({ user: mockUser, auction: mockAuction });
  });

  it('should not follow if already followed', async () => {
    userRepo.findOneBy.mockResolvedValue({ id: 1 } as any);
    auctionRepo.findOneBy.mockResolvedValue({ id: 2 } as any);
    followRepo.findOne.mockResolvedValue({ id: 10 } as any);

    await service.followAuction(1, 2);

    expect(followRepo.save).not.toHaveBeenCalled();
  });

  it('should throw if user or auction not found', async () => {
    userRepo.findOneBy.mockResolvedValue(null);

    await expect(service.followAuction(1, 2)).rejects.toThrow(NotFoundException);
  });

  it('should unfollow an auction', async () => {
    await service.unfollowAuction(1, 2);

    expect(followRepo.delete).toHaveBeenCalledWith({
      user: { id: 1 },
      auction: { id: 2 },
    });
  });

  it('should return followed auctions', async () => {
    const fakeAuction = { id: 9, artefact: {}, artefactId: 1 };
    followRepo.find.mockResolvedValue([{ auction: fakeAuction } as any]);

    const result = await service.getFollowedAuctions(1);

    expect(result).toEqual([fakeAuction]);
    expect(followRepo.find).toHaveBeenCalledWith({
      where: { user: { id: 1 } },
      relations: ['auction', 'auction.artefact', 'auction.artefact.loot'],
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ArtefactService } from './artefact.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Artefact } from 'src/shared/entities/artefact.entity';
import { Repository } from 'typeorm';

describe('ArtefactService', () => {
  let service: ArtefactService;
  let repo: Repository<Artefact>;

  const mockArtefacts = [
    { id: 1, isInAuction: false, owner: { id: 1 }, loot: { name: 'Test Loot' } },
    { id: 2, isInAuction: true, owner: { id: 1 }, loot: { name: 'Loot 2' } },
  ];

  const mockRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtefactService,
        {
          provide: getRepositoryToken(Artefact),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ArtefactService>(ArtefactService);
    repo = module.get<Repository<Artefact>>(getRepositoryToken(Artefact));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return artefacts not in auction for user', async () => {
    mockRepo.find.mockResolvedValue([mockArtefacts[0]]);

    const result = await service.getArtefactsByUser(1);
    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { owner: { id: 1 }, isInAuction: false },
      relations: ['loot'],
    });
    expect(result).toEqual([mockArtefacts[0]]);
  });

  it('should return all artefacts for user', async () => {
    mockRepo.find.mockResolvedValue(mockArtefacts);

    const result = await service.getAllArtefactsByUser(1);
    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { owner: { id: 1 } },
      relations: ['loot'],
    });
    expect(result).toEqual(mockArtefacts);
  });
});

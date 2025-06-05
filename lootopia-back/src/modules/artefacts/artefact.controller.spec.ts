import { Test, TestingModule } from '@nestjs/testing';
import { ArtefactController } from './artefact.controller';
import { ArtefactService } from './artefact.service';

describe('ArtefactController', () => {
  let controller: ArtefactController;
  let service: ArtefactService;

  const mockArtefacts = [{ id: 1 }, { id: 2 }];

  const mockArtefactService = {
    getArtefactsByUser: jest.fn().mockResolvedValue([mockArtefacts[0]]),
    getAllArtefactsByUser: jest.fn().mockResolvedValue(mockArtefacts),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtefactController],
      providers: [
        {
          provide: ArtefactService,
          useValue: mockArtefactService,
        },
      ],
    }).compile();

    controller = module.get<ArtefactController>(ArtefactController);
    service = module.get<ArtefactService>(ArtefactService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return artefacts not in auction from service', async () => {
    const req = { user: { userId: 1 } } as any;
    const result = await controller.getMyArtefacts(req);
    expect(service.getArtefactsByUser).toHaveBeenCalledWith(1);
    expect(result).toEqual([mockArtefacts[0]]);
  });

  it('should return all artefacts from service', async () => {
    const req = { user: { userId: 1 } } as any;
    const result = await controller.getAllMyArtefacts(req);
    expect(service.getAllArtefactsByUser).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockArtefacts);
  });
});

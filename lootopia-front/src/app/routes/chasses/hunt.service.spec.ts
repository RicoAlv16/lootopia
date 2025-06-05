import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HuntService } from './hunt.service';
import { CreatedHunt, HuntForm } from './chasses.interface';
import { ActiveHunt } from '../chasses-aux-tresors/chasses-actives.interface';
import { environment } from '../../../env/env.dev';

describe('HuntService', () => {
  let service: HuntService;
  let httpMock: HttpTestingController;
  let backend: environment;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HuntService]
    });
    service = TestBed.inject(HuntService);
    httpMock = TestBed.inject(HttpTestingController);
    backend = new environment();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createHunt', () => {
    it('should create a hunt successfully', () => {
      const mockHuntForm: HuntForm = {
        title: 'Test Hunt',
        description: 'Test Description',
        duration: 60,
        worldType: 'real',
        mode: 'competitive',
        maxParticipants: 10,
        participationFee: 5,
        chatEnabled: true,
        interactiveMap: true,
        mapConfig: {
          name: 'Test Map',
          skin: 'default',
          zone: 'city',
          scale: 1
        },
        steps: [],
        landmarks: [],
        rewards: {
          first: 100,
          second: 50,
          third: 25
        },
        searchDelay: 30,
        searchCost: 1
      };

      const mockCreatedHunt: CreatedHunt = {
        id: '1',
        user: 'test@example.com',
        ...mockHuntForm,
        status: 'draft',
        participants: 0,
        createdAt: new Date()
      };

      const email = 'test@example.com';

      service.createHunt(mockHuntForm, email).subscribe(hunt => {
        expect(hunt).toEqual(mockCreatedHunt);
      });

      const req = httpMock.expectOne(`${backend.apiUrl}/hunts/create-hunt`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ ...mockHuntForm, email });
      req.flush(mockCreatedHunt);
    });
  });

  describe('getMyHunts', () => {
    it('should retrieve user hunts', () => {
      const email = 'test@example.com';
      const mockHunts: CreatedHunt[] = [
        {
          id: '1',
          user: email,
          title: 'Hunt 1',
          description: 'Description 1',
          duration: 60,
          worldType: 'real',
          mode: 'competitive',
          maxParticipants: 10,
          participationFee: 5,
          chatEnabled: true,
          interactiveMap: true,
          mapConfig: {
            name: 'Map 1',
            skin: 'default',
            zone: 'city',
            scale: 1
          },
          steps: [],
          landmarks: [],
          rewards: {
            first: 100,
            second: 50,
            third: 25
          },
          searchDelay: 30,
          searchCost: 1,
          status: 'draft',
          participants: 0,
          createdAt: new Date()
        }
      ];

      service.getMyHunts(email).subscribe(hunts => {
        expect(hunts).toEqual(mockHunts);
        expect(hunts.length).toBe(1);
      });

      const req = httpMock.expectOne(`${backend.apiUrl}/hunts/my-hunts`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush(mockHunts);
    });
  });

  describe('getHunt', () => {
    it('should retrieve a specific hunt', () => {
      const huntId = '1';
      const email = 'test@example.com';
      const mockHunt: CreatedHunt = {
        id: huntId,
        user: email,
        title: 'Test Hunt',
        description: 'Test Description',
        duration: 60,
        worldType: 'real',
        mode: 'competitive',
        maxParticipants: 10,
        participationFee: 5,
        chatEnabled: true,
        interactiveMap: true,
        mapConfig: {
          name: 'Test Map',
          skin: 'default',
          zone: 'city',
          scale: 1
        },
        steps: [],
        landmarks: [],
        rewards: {
          first: 100,
          second: 50,
          third: 25
        },
        searchDelay: 30,
        searchCost: 1,
        status: 'draft',
        participants: 0,
        createdAt: new Date()
      };

      service.getHunt(huntId, email).subscribe(hunt => {
        expect(hunt).toEqual(mockHunt);
      });

      const req = httpMock.expectOne(`${backend.apiUrl}/hunts/find`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ id: huntId, email });
      req.flush(mockHunt);
    });
  });

  describe('updateHunt', () => {
    it('should update a hunt successfully', () => {
      const huntId = '1';
      const email = 'test@example.com';
      const updateData: Partial<HuntForm> = {
        title: 'Updated Hunt Title',
        description: 'Updated Description'
      };
      const mockUpdatedHunt: CreatedHunt = {
        id: huntId,
        user: email,
        title: 'Updated Hunt Title',
        description: 'Updated Description',
        duration: 60,
        worldType: 'real',
        mode: 'competitive',
        maxParticipants: 10,
        participationFee: 5,
        chatEnabled: true,
        interactiveMap: true,
        mapConfig: {
          name: 'Test Map',
          skin: 'default',
          zone: 'city',
          scale: 1
        },
        steps: [],
        landmarks: [],
        rewards: {
          first: 100,
          second: 50,
          third: 25
        },
        searchDelay: 30,
        searchCost: 1,
        status: 'draft',
        participants: 0,
        createdAt: new Date()
      };

      service.updateHunt(huntId, updateData, email).subscribe(hunt => {
        expect(hunt).toEqual(mockUpdatedHunt);
      });

      const req = httpMock.expectOne(`${backend.apiUrl}/hunts/update-hunt`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        id: huntId,
        email,
        updateData
      });
      req.flush(mockUpdatedHunt);
    });
  });

  describe('deleteHunt', () => {
    it('should delete a hunt successfully', () => {
      const huntId = '1';
      const email = 'test@example.com';

      service.deleteHunt(huntId, email).subscribe(response => {
        expect(response).toBeNull(); // Changé de toBeUndefined() à toBeNull()
      });

      const req = httpMock.expectOne(`${backend.apiUrl}/hunts/delete-hunt`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ id: huntId, email });
      req.flush(null); // Correct - on simule une réponse null
    });
  });

  describe('publishHunt', () => {
    it('should publish a hunt successfully', () => {
      const huntId = '1';
      const email = 'test@example.com';
      const mockPublishedHunt: CreatedHunt = {
        id: huntId,
        user: email,
        title: 'Published Hunt',
        description: 'Published Description',
        duration: 60,
        worldType: 'real',
        mode: 'competitive',
        maxParticipants: 10,
        participationFee: 5,
        chatEnabled: true,
        interactiveMap: true,
        mapConfig: {
          name: 'Test Map',
          skin: 'default',
          zone: 'city',
          scale: 1
        },
        steps: [],
        landmarks: [],
        rewards: {
          first: 100,
          second: 50,
          third: 25
        },
        searchDelay: 30,
        searchCost: 1,
        status: 'active',
        participants: 0,
        createdAt: new Date()
      };

      service.publishHunt(huntId, email).subscribe(hunt => {
        expect(hunt).toEqual(mockPublishedHunt);
        expect(hunt.status).toBe('active');
      });

      const req = httpMock.expectOne(`${backend.apiUrl}/hunts/publish-hunt`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ id: huntId, email });
      req.flush(mockPublishedHunt);
    });
  });

  describe('getActiveHunts', () => {
    it('should retrieve active hunts', () => {
      const mockActiveHunts: ActiveHunt[] = [
        {
          id: '1',
          title: 'Active Hunt 1',
          description: 'Active Description 1',
          duration: 60,
          worldType: 'real',
          mode: 'competitive',
          maxParticipants: 10,
          participationFee: 5,
          chatEnabled: true,
          interactiveMap: true,
          mapConfig: {
            name: 'Active Map',
            skin: 'default',
            zone: 'city',
            scale: 1
          },
          steps: [],
          landmarks: [],
          rewards: {
            first: 100,
            second: 50,
            third: 25
          },
          searchDelay: 30,
          searchCost: 1,
          status: 'active',
          participants: 5,
          user: {
            email: 'creator@example.com',
            nickname: 'Creator',
            id: 'user1'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      service.getActiveHunts().subscribe(hunts => {
        expect(hunts).toEqual(mockActiveHunts);
        expect(hunts.length).toBe(1);
        expect(hunts[0].status).toBe('active');
      });

      const req = httpMock.expectOne(`${backend.apiUrl}/hunts/active-hunts`);
      expect(req.request.method).toBe('GET');
      req.flush(mockActiveHunts);
    });
  });

  describe('joinHunt', () => {
    it('should join a hunt successfully', () => {
      const huntId = '1';
      const email = 'participant@example.com';
      const mockResponse = { success: true, message: 'Joined successfully' };

      service.joinHunt(huntId, email).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${backend.apiUrl}/hunts/join`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, huntId });
      req.flush(mockResponse);
    });
  });

  describe('leaveHunt', () => {
    it('should leave a hunt successfully', () => {
      const huntId = '1';
      const email = 'participant@example.com';
      const mockResponse = { success: true, message: 'Left successfully' };

      service.leaveHunt(huntId, email).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${backend.apiUrl}/hunts/leave`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, huntId });
      req.flush(mockResponse);
    });
  });

  describe('getMyParticipations', () => {
    it('should retrieve user participations', () => {
      const email = 'participant@example.com';
      const mockParticipations = [
        {
          id: '1',
          huntId: 'hunt1',
          huntTitle: 'Participated Hunt',
          status: 'active',
          joinedAt: new Date()
        }
      ];

      service.getMyParticipations(email).subscribe(participations => {
        expect(participations).toEqual(mockParticipations);
        expect(participations.length).toBe(1);
      });

      const req = httpMock.expectOne(`${backend.apiUrl}/hunts/my-participations`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush(mockParticipations);
    });
  });

  describe('Error handling', () => {
    it('should handle HTTP errors gracefully', () => {
      const email = 'test@example.com';
      const errorMessage = 'Server error';

      service.getMyHunts(email).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${backend.apiUrl}/hunts/my-hunts`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
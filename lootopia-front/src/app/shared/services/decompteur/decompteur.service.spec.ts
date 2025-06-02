import { TestBed } from '@angular/core/testing';
import { DecompteurService } from './decompteur.service';

describe('DecompteurService', () => {
  let service: DecompteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecompteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

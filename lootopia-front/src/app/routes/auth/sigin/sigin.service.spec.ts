import { TestBed } from '@angular/core/testing';

import { SiginService } from './sigin.service';

describe('SiginService', () => {
  let service: SiginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

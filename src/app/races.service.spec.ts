import { TestBed } from '@angular/core/testing';

import { RacesService } from './races.service';

describe('RacesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RacesService = TestBed.get(RacesService);
    expect(service).toBeTruthy();
  });
});

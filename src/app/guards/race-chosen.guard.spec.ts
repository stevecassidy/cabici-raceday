import { TestBed, async, inject } from '@angular/core/testing';

import { RaceChosenGuard } from './race-chosen.guard';

describe('RaceChosenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaceChosenGuard]
    });
  });

  it('should ...', inject([RaceChosenGuard], (guard: RaceChosenGuard) => {
    expect(guard).toBeTruthy();
  }));
});

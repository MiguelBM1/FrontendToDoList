import { TestBed } from '@angular/core/testing';

import { HijosGuard } from './hijos.guard';

describe('HijosGuard', () => {
  let guard: HijosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HijosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

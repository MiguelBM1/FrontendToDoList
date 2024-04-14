import { TestBed } from '@angular/core/testing';

import { SalirAGuard } from './salir-a.guard';

describe('SalirAGuard', () => {
  let guard: SalirAGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SalirAGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

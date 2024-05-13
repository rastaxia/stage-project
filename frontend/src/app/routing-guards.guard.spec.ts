import { TestBed } from '@angular/core/testing';

import { isLoggedIn } from './routing-guards.guard';

describe('RoutingGuardsGuard', () => {
  let guard: isLoggedIn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(isLoggedIn);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

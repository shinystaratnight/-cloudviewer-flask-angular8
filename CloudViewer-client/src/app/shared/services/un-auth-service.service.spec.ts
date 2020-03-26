import { TestBed } from '@angular/core/testing';

import { UnAuthService } from './un-auth-service.service';

describe('UnAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnAuthService = TestBed.get(UnAuthService);
    expect(service).toBeTruthy();
  });
});

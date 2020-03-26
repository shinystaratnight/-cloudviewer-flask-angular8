import { TestBed } from '@angular/core/testing';

import { DomainServiceService } from './domain-service.service';

describe('DomainServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DomainServiceService = TestBed.get(DomainServiceService);
    expect(service).toBeTruthy();
  });
});

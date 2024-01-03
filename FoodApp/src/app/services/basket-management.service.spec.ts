import { TestBed } from '@angular/core/testing';

import { BasketManagementService } from './basket-management.service';

describe('BasketManagementService', () => {
  let service: BasketManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasketManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

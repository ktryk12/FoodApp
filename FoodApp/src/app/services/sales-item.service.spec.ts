import { TestBed } from '@angular/core/testing';

import { SalesItemService } from './sales-item.service';

describe('SalesItemService', () => {
  let service: SalesItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

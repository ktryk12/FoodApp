import { TestBed } from '@angular/core/testing';

import { SalesItemCompositionService } from './sales-item-composition.service';

describe('SalesItemCompositionService', () => {
  let service: SalesItemCompositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesItemCompositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

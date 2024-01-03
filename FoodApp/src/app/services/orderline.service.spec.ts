import { TestBed } from '@angular/core/testing';

import { OrderlineService } from './orderline.service';

describe('OrderlineService', () => {
  let service: OrderlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

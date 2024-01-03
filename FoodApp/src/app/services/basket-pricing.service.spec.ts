import { TestBed } from '@angular/core/testing';

import { BasketPricingService } from './basket-pricing.service';

describe('BasketPricingService', () => {
  let service: BasketPricingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasketPricingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

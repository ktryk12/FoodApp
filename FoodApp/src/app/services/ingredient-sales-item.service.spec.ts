import { TestBed } from '@angular/core/testing';

import { IngredientSalesItemService } from './ingredient-sales-item.service';

describe('IngredientSaleItemService', () => {
  let service: IngredientSalesItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientSalesItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

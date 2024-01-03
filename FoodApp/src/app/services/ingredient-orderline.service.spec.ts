import { TestBed } from '@angular/core/testing';

import { IngredientOrderlineService } from './ingredient-orderline.service';

describe('IngredientOrderlineService', () => {
  let service: IngredientOrderlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientOrderlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

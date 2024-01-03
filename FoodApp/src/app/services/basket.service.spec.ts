import { TestBed } from '@angular/core/testing';
import { BasketService } from './basket.service';
import { BasketManagementService } from './basket-management.service';
import { BasketItem } from '../dtos/basket-item.dto';
import { SalesItem } from '../dtos/sales-item.dto';
import { of } from 'rxjs';

describe('BasketService', () => {
  let service: BasketService;
  let basketManagementService: jasmine.SpyObj<BasketManagementService>;

  beforeEach(() => {
    basketManagementService = jasmine.createSpyObj('BasketManagementService', ['addCompositeItem', 'addItem', 'removeItem', 'basketItems$']);

    TestBed.configureTestingModule({
      providers: [
        BasketService,
        { provide: BasketManagementService, useValue: basketManagementService }
        // ... andre providers
      ]
    });

    service = TestBed.inject(BasketService);
  });

  it('#getBasketItems should return observable value from basketManagementService', () => {
    // Opret mockSalesItem først
    const mockSalesItem: SalesItem = {
      id: 101, // Erstat med realistiske værdier
      name: 'Test Item',
      productNumber: '123456',
      imageUrl: 'http://example.com/image.jpg',
      basePrice: 50,
      category: 'Test Category',
      salesItemGroup: 1,
      isActive: true,
      isComposite: false,
      // ... andre nødvendige felter for SalesItem
    };

    // Brug mockSalesItem til at oprette BasketItem
    const expectedItems: BasketItem[] = [
      new BasketItem(1, 2, mockSalesItem, 100),
      // ... yderligere BasketItem instanser efter behov
    ];

    spyOnProperty(basketManagementService, 'basketItems$').and.returnValue(of(expectedItems));

    service.getBasketItems().subscribe(items => {
      expect(items).toEqual(expectedItems);
    });
  });

// ... dine andre tests




  it('#addItemToBasket should call addCompositeItem if isComposite is true', () => {
    service.addItemToBasket(123, 2, true);
    expect(basketManagementService.addCompositeItem).toHaveBeenCalledWith(123, 2);
  });

  it('#addItemToBasket should call addItem if isComposite is false', () => {
    service.addItemToBasket(123, 2);
    expect(basketManagementService.addItem).toHaveBeenCalledWith(123, 2);
  });

  it('#removeItemFromBasket should call removeItem', () => {
    service.removeItemFromBasket(123);
    expect(basketManagementService.removeItem).toHaveBeenCalledWith(123);
  });

  

  // Add more tests as necessary for other methods and scenarios
});

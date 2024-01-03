import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BasketIngredientService } from './basket-ingredient.service';
import { BasketManagementService } from './basket-management.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesItemService } from '../services/sales-item.service';
import { BasketItem } from '../dtos/basket-item.dto';
import { SalesItem } from '../dtos/sales-item.dto';
import { of } from 'rxjs';

describe('BasketIngredientService', () => {
  let service: BasketIngredientService;
  let basketManagementService: jasmine.SpyObj<BasketManagementService>;
  let salesItemService: jasmine.SpyObj<SalesItemService>;

  beforeEach(() => {
    // Opretter spy objekter
    basketManagementService = jasmine.createSpyObj('BasketManagementService', ['findBasketItem', 'updateBasketItems']);
    salesItemService = jasmine.createSpyObj('SalesItemService', ['getSalesItemById']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BasketIngredientService,
        { provide: BasketManagementService, useValue: basketManagementService },
        { provide: SalesItemService, useValue: salesItemService }
      ]
    });

    service = TestBed.inject(BasketIngredientService);
    // Bemærk: Ingen nødvendighed for at kalde spyOn her, da metoderne allerede er spioneret via createSpyObj
  });

  it('should modify ingredient in basket item', () => {
    const basketItemId = 1;
    const ingredientId = 2;
    const add = true; // Antager at vi tilføjer ingrediensen

    // Opret en mock BasketItem
    const mockBasketItem = new BasketItem(basketItemId, 1);
    mockBasketItem.ingredientSalesItems = [];

    // Opsætning af basketManagementService til at returnere mockBasketItem
    basketManagementService.findBasketItem.and.returnValue(mockBasketItem);

    // Kald modifyIngredient
    service.modifyIngredient(basketItemId, ingredientId, add);

    // Bekræft, at salesItemService.getSalesItemById blev kaldt, hvis relevant
    // Bemærk: Dette afhænger af, hvordan din service håndterer ingrediens-tilføjelser
    // expect(salesItemService.getSalesItemById).toHaveBeenCalled();  // Kun relevant hvis getSalesItemById faktisk kaldes i modifyIngredient

    // Bekræft, at updateBasketItems blev kaldt med det modificerede BasketItem
    expect(basketManagementService.updateBasketItems).toHaveBeenCalledWith(mockBasketItem);

    // Yderligere assertions kan tilføjes for at verificere, at ingrediensen blev tilføjet korrekt
  });
  it('should modify ingredient in basket item', () => {
    const basketItemId = 1;
    const ingredientId = 2;
    const add = true; // Antager at vi tilføjer ingrediensen

    const mockBasketItem = new BasketItem(basketItemId, 1);
    mockBasketItem.ingredientSalesItems = [];

    basketManagementService.findBasketItem.and.returnValue(mockBasketItem);

    // Kald modifyIngredient
    service.modifyIngredient(basketItemId, ingredientId, add);

    // Tjek om updateBasketItems blev kaldt med det forventede argument
    expect(basketManagementService.updateBasketItems).toHaveBeenCalledWith(mockBasketItem);

    // Yderligere assertions...
  });
  it('should modify ingredient in basket item', () => {
    const basketItemId = 1;
    const ingredientId = 2;
    const add = true; // Antager at vi tilføjer ingrediensen

    const mockBasketItem = new BasketItem(basketItemId, 1);
    mockBasketItem.ingredientSalesItems = [];

    basketManagementService.findBasketItem.and.returnValue(mockBasketItem);

    // Kald modifyIngredient
    service.modifyIngredient(basketItemId, ingredientId, add);

    // Hvis modifyIngredient er asynkron, kan det være nødvendigt at bruge fakeAsync og tick() her

    // Bekræft, at updateBasketItems blev kaldt med det modificerede BasketItem
    expect(basketManagementService.updateBasketItems).toHaveBeenCalledWith(mockBasketItem);
  });
  it('should modify ingredient in basket item', fakeAsync(() => {
    const basketItemId = 1;
    const ingredientId = 2;
    const add = true;

    const mockBasketItem = new BasketItem(basketItemId, 1);
    mockBasketItem.ingredientSalesItems = [];

    basketManagementService.findBasketItem.and.returnValue(mockBasketItem);

    service.modifyIngredient(basketItemId, ingredientId, add);

    tick(); // Simulerer passage af tid for asynkrone operationer

    expect(basketManagementService.updateBasketItems).toHaveBeenCalledWith(mockBasketItem);
  }));


  // ... yderligere tests ...
});

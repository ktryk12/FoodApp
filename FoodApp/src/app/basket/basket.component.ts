import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BasketService } from '../services/basket.service';
import { BasketItem } from '../dtos/basket-item.dto';
import { Subscription } from 'rxjs';
import { SalesItemService } from '../services/sales-item.service';
import { IngredientSalesItemService } from '../services/ingredient-sales-item.service';
import { SalesItemCompositionService } from '../services/sales-item-composition.service';
import { IngredientService } from '../services/ingredient.service';
import { IngredientSalesItemDetails } from '../dtos/ingredient-sales-item-details.dto';
import { SalesItemCompositionWithDetails } from '../dtos/sales-item-composition-with-details.dto';
import { SalesItem } from '../dtos/sales-item.dto';
import { Ingredient } from '../dtos/ingredient.dto';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  basketItems: BasketItem[] = [];
  selectedBasketItem: BasketItem | null = null;
  availableIngredients: { [salesItemId: number]: IngredientSalesItemDetails[] } = {};
  private subscriptions = new Subscription();
  compositionWithDetails?: SalesItemCompositionWithDetails;
  constructor(
    private basketService: BasketService,
    private cdr: ChangeDetectorRef,
    private salesItemService: SalesItemService,
    private salesItemCompositionService: SalesItemCompositionService,
    private ingredientService: IngredientService,
    private ingredientSalesItemService: IngredientSalesItemService
  ) { }

  // I BasketComponent

  ngOnInit(): void {
    this.subscriptions.add(
      this.basketService.basketItems$.subscribe(basketItems => {
        this.basketItems = basketItems;
        basketItems.forEach(item => {
          if (item.item instanceof SalesItem) {
            this.loadAvailableIngredientsForSalesItem(item.item.id);
          } else if (item.item instanceof SalesItemComposition) {
            // Brug parentItem.id eller en anden relevant identifikator
            const parentItemId = item.item.parentItem?.id;
            if (parentItemId) {
              this.loadCompositionWithDetails(parentItemId);
            }
          }
        });
        this.cdr.detectChanges();
      })
    );
  }

  loadCompositionWithDetails(parentItemId: number): void {
    this.salesItemCompositionService.getCompositionWithDetails(parentItemId).subscribe(
      (compositionDetails) => {
        if (compositionDetails) {
          // Tilføj logik til at håndtere compositionDetails...
          this.loadAvailableIngredientsForComposition(compositionDetails);
        }
      },
      error => console.error('Error fetching composition details', error)
    );
  }

  loadAvailableIngredientsForSalesItem(salesItemId: number): void {
    this.ingredientService.getIngredientsWithDetailsBySalesItemId(salesItemId).subscribe(
      ingredients => {
        // Tilføj logik til at håndtere ingredients...
      },
      error => console.error('Error loading ingredients', error)
    );
  }

  loadAvailableIngredientsForComposition(compositionDetails: SalesItemCompositionWithDetails): void {
    compositionDetails.childItems?.forEach(childItem => {
      this.ingredientService.getIngredientsWithDetailsBySalesItemId(childItem.id).subscribe(
        ingredients => {
          // Tilføj logik til at håndtere ingredients...
        },
        error => console.error(`Error loading ingredients for childItem ${childItem.id}`, error)
      );
    });
  }






  onAddIngredientToChild(childItemId: number, ingredientId: number): void {
    this.basketService.addIngredientToBasketItemChild(childItemId, ingredientId);
  }

  onRemoveIngredientFromChild(childItemId: number, ingredientId: number): void {
    this.basketService.removeIngredientFromBasketItemChild(childItemId, ingredientId);
  }

  onSelectComposition(arg: number | SalesItemCompositionWithDetails): void {
    if (typeof arg === 'number') {
      // Håndter parentItemId
      this.basketService.loadCompositionWithDetails(arg);
    } else {
      // Håndter compositionDetails
      this.basketService.loadAvailableIngredientsForComposition(arg);
    }
  }


  addIngredient(basketItemId: number, ingredientId: number): void {
    this.basketService.addIngredientToBasketItem(basketItemId, ingredientId);
  }

  removeIngredient(basketItemId: number, ingredientId: number): void {
    this.basketService.removeIngredientFromBasketItem(basketItemId, ingredientId);
  }

  getFullImagePath(relativePath: string | undefined): string {
    return relativePath ? `https://localhost:7218${relativePath}` : '';
  }
  getItemName(basketItem: BasketItem): string {
    if (this.isSalesItem(basketItem.item)) {
      return basketItem.item.name;
    } else if (this.isSalesItemComposition(basketItem.item)) {
      return basketItem.item.parentItem?.name || 'Ukendt Sammensætning';
    }
    return 'Ukendt Item';
  }

  isSalesItem(item: SalesItem | SalesItemComposition): item is SalesItem {
    return (item as SalesItem).imageUrl !== undefined;
  }

  isSalesItemComposition(item: SalesItem | SalesItemComposition): item is SalesItemComposition {
    return (item as SalesItemComposition).parentItem !== undefined;
  }
  

  
  getTotalPrice(): number {
    return this.basketService.getTotalPrice();
  }

  clearBasket(): void {
    this.basketService.clearBasket();
  }

  // Andre nødvendige metoder...
}

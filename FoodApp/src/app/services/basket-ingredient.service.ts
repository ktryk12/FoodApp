// basket-ingredient.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BasketItem } from '../dtos/basket-item.dto';
import { IngredientSalesItem } from '../dtos/ingredient-sales-item.dto'; // Tilpas stien efter behov
import { IngredientSalesItemService } from './ingredient-sales-item.service';
import { SalesItemService } from '../services/sales-item.service';
import { SalesItemCompositionService } from '../services/sales-item-composition.service';
import { forkJoin } from 'rxjs';
import { BasketUtilsService } from './basket-utils.service';
import { IngredientService } from './ingredient.service';

@Injectable({
  providedIn: 'root'
})
export class BasketIngredientService implements OnDestroy {
  private destroy$ = new Subject<void>();
 
  constructor(
    private ingredientSalesItemService: IngredientSalesItemService,
    private salesItemService: SalesItemService,
    private salesItemCompositionService: SalesItemCompositionService,
    private ingredientService: IngredientService,
    private basketUtilsService: BasketUtilsService,
    

    
  ) { // Abonnerer på tilføjelse af nye items
    this.basketUtilsService.basketItemAdded$.pipe(takeUntil(this.destroy$)).subscribe(
      (newItem: BasketItem | null) => {
        if (newItem) {
          this.handleNewItemAdded(newItem);
        }
      }
    );
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleNewItemAdded(newItem: BasketItem): void {
    // Check if ingredient details are already loaded to avoid infinite loop
    if (!newItem.ingredientSalesItemsDetails) {
      if (newItem.salesItem) {
        this.loadIngredientsForSingleSalesItem(newItem);
      } else if (newItem.salesItemCompositions) {
        this.loadIngredientsForCompositeSalesItem(newItem.id);
      }
    }
  }

  
 
  
 loadIngredientsForSingleSalesItem(basketItem: BasketItem): void {
    this.ingredientService.getIngredientsWithDetailsBySalesItemId(basketItem.salesItem!.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(ingredientDetails => {
        basketItem.ingredientSalesItemsDetails = ingredientDetails;
        this.updateBasketItem(basketItem);
      });
  }

  

  loadIngredientsForCompositeSalesItem(basketItemId: number): void {
    const basketItem = this.basketUtilsService.findBasketItem(basketItemId);
    if (basketItem && !basketItem.ingredientSalesItemsDetails) {
      this.salesItemCompositionService.getCompositionsByParentItemId(basketItemId)
        .pipe(takeUntil(this.destroy$)) // Unsubscribe logic
        .subscribe(compositions => {
          const validCompositions = compositions.filter(comp => comp.childItemId !== undefined);

          const ingredientDetailsLoaders = validCompositions.map(composition =>
            this.ingredientService.getIngredientsWithDetailsBySalesItemId(composition.childItemId!)
          );

          forkJoin(ingredientDetailsLoaders)
            .pipe(takeUntil(this.destroy$)) // Unsubscribe logic
            .subscribe(ingredientsDetailsArrays => {
              basketItem.ingredientSalesItemsDetails = ingredientsDetailsArrays.flat();
              this.updateBasketItem(basketItem);
            });
        });
    }
  }







  modifyIngredient(basketItemId: number, ingredientId: number, add: boolean): void {
    const basketItem = this.basketUtilsService.findBasketItem(basketItemId);
    if (basketItem) {
      const delta = add ? 1 : -1;
      this.applyIngredientChanges(basketItem, ingredientId, delta);
    }
  }

  private applyIngredientChanges(basketItem: BasketItem, ingredientId: number, delta: number): void {
    const existingIngredient = basketItem.ingredientSalesItems?.find(i => i.ingredientId === ingredientId);

    if (existingIngredient) {
      existingIngredient.count += delta;
      this.removeIngredientIfCountIsZero(basketItem, existingIngredient);
    } else if (delta > 0) {
      // Håndterer enkeltstående SalesItem
      if (basketItem.salesItem) {
        this.addNewIngredientToSalesItem(basketItem, ingredientId, delta);
      }
      // Håndterer sammensatte SalesItems
      else if (basketItem.salesItemCompositions) {
        this.addNewIngredientToCompositeItem(basketItem, ingredientId, delta);
      } else {
        console.error('BasketItem mangler salesItem og salesItemCompositions');
      }
    }
  }



  private removeIngredientIfCountIsZero(basketItem: BasketItem, ingredientSalesItem: IngredientSalesItem): void {
    if (ingredientSalesItem.count <= 0) {
      basketItem.ingredientSalesItems = basketItem.ingredientSalesItems?.filter(i => i !== ingredientSalesItem);
    }
  }

  private addNewIngredientToSalesItem(basketItem: BasketItem, ingredientId: number, delta: number) {
    // Sikrer, at salesItem og dets id er defineret
    if (basketItem.salesItem && basketItem.salesItem.id !== undefined) {
      this.salesItemService.getSalesItemById(basketItem.salesItem.id).subscribe(salesItem => {
        const ingredientSalesItemData = salesItem.ingredientSalesItems?.find(i => i.ingredientId === ingredientId);

        if (ingredientSalesItemData) {
          const newIngredientSalesItem: IngredientSalesItem = {
            salesItemId: basketItem.id,
            ingredientId: ingredientId,
            count: delta,
            min: ingredientSalesItemData.min,
            max: ingredientSalesItemData.max,
          };

          if (!basketItem.ingredientSalesItems) {
            basketItem.ingredientSalesItems = [];
          }
          basketItem.ingredientSalesItems.push(newIngredientSalesItem);

          this.updateBasketItem(basketItem);
        }
      });
    }
  }

  private addNewIngredientToCompositeItem(basketItem: BasketItem, ingredientId: number, delta: number) {
    // Antager at basketItem har et parentItemId
    const parentItemId = basketItem.id;

    // Hent kompositionerne for det givne parentItemId
    this.salesItemCompositionService.getCompositionsByParentItemId(parentItemId).subscribe(compositions => {
      // Behandler hver child-item i kompositionerne
      compositions.forEach(composition => {
        if (composition.childItemId) {
          this.salesItemService.getSalesItemById(composition.childItemId).subscribe(salesItem => {
            const ingredientSalesItemData = salesItem.ingredientSalesItems?.find(i => i.ingredientId === ingredientId);

            if (ingredientSalesItemData) {
              const newIngredientSalesItem: IngredientSalesItem = {
                salesItemId: basketItem.id,
                ingredientId: ingredientId,
                count: delta,
                min: ingredientSalesItemData.min,
                max: ingredientSalesItemData.max,
              };

              if (!basketItem.ingredientSalesItems) {
                basketItem.ingredientSalesItems = [];
              }
              basketItem.ingredientSalesItems.push(newIngredientSalesItem);

              // Opdaterer basketItem
              this.updateBasketItem(basketItem);
            }
          });
        }
      });
    });
  }


  async calculateTotalIngredientPrice(ingredientSalesItems: IngredientSalesItem[]): Promise<number> {
    let totalIngredientPrice = 0;

    for (const item of ingredientSalesItems) {
      const ingredient = await this.ingredientService.getIngredientById(item.ingredientId).toPromise();
      if (ingredient) {
        totalIngredientPrice += ingredient.ingredientPrice * item.count;
      }
    }

    return totalIngredientPrice;
  }
  private updateBasketItem(basketItem: BasketItem): void {
    this.basketUtilsService.updateBasketItem(basketItem);
  }
  
}





  

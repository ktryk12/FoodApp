import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { BasketItem } from '../dtos/basket-item.dto';
import { SalesItem } from '../dtos/sales-item.dto';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';
import { SalesItemCompositionWithDetails } from '../dtos/sales-item-composition-with-details.dto';
import { IngredientSalesItem } from '../dtos/ingredient-sales-item.dto';
import { PricingService } from './pricing.service';
import { IngredientSalesItemDetails } from '../dtos/ingredient-sales-item-details.dto';
import { IngredientSalesItemService } from '../services/ingredient-sales-item.service';
import { catchError, tap } from 'rxjs/operators';
import { IngredientService } from './ingredient.service';
import { Ingredient } from '../dtos/ingredient.dto';
import { SalesItemCompositionService } from '../services/sales-item-composition.service';

const defaultIngredient: Ingredient = {
  id: 0,
  name: 'Standard Ingredient',
  imageUrl: 'default-image-url',
  ingredientPrice: 0
};
@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private basketItemsSource = new BehaviorSubject<BasketItem[]>([]);
  public basketItems$ = this.basketItemsSource.asObservable();
  private availableIngredientsSource = new BehaviorSubject<{ [salesItemId: number]: IngredientSalesItemDetails[] }>({});
  availableIngredients$ = this.availableIngredientsSource.asObservable();
  private compositionDetailsSource = new BehaviorSubject<SalesItemCompositionWithDetails | null>(null);
  compositionDetails$ = this.compositionDetailsSource.asObservable();
  constructor(
    private pricingService: PricingService,
    private ingredientSalesItemService: IngredientSalesItemService,
    private ingredientService: IngredientService,
    private salesItemCompositionService: SalesItemCompositionService
  ) { }

  // Tilføj en SalesItem til kurven
  // Adjust the addToBasket method to handle Observable<number>

  addToBasket(item: BasketItem): void {
    const currentBasketItems = this.basketItemsSource.value;
    item.totalPrice = this.calculateBasketItemPrice(item); // Genberegner totalprisen
    const updatedBasketItems = [...currentBasketItems, item];
    this.basketItemsSource.next(updatedBasketItems);
    console.log('Basket updated with new item:', item);
  }


  loadAvailableIngredients(salesItemId: number): void {
    this.ingredientService.getIngredientsWithDetailsBySalesItemId(salesItemId)
      .subscribe(
        ingredients => {
          const currentOptions = this.availableIngredientsSource.value;
          currentOptions[salesItemId] = ingredients;
          this.availableIngredientsSource.next(currentOptions);
        },
        error => console.error('Error loading ingredients for salesItemId:', salesItemId, error)
      );
  }

  loadAvailableIngredientsForComposition(compositionDetails: SalesItemCompositionWithDetails): void {
    compositionDetails.childItems?.forEach(childItem => {
      this.ingredientService.getIngredientsWithDetailsBySalesItemId(childItem.id).subscribe(
        ingredients => {
          const currentOptions = this.availableIngredientsSource.value;
          currentOptions[childItem.id] = ingredients;
          this.availableIngredientsSource.next(currentOptions);
        },
        error => console.error(`Error loading ingredients for childItem ${childItem.id}`, error)
      );
    });
  }


  loadCompositionWithDetails(parentItemId: number): void {
    this.salesItemCompositionService.getCompositionWithDetails(parentItemId).subscribe(
      (compositionDetails) => {
        if (compositionDetails) {
          this.compositionDetailsSource.next(compositionDetails); // Opdaterer tilstandsvariablen
          
        } else {
          console.error('Composition details are missing');
        }
      },
      error => console.error('Error fetching composition details', error)
    );
  }

   // This method updates the entire basket with a new array of BasketItems.
  public updateBasketItems(newItems: BasketItem[]): void {
    this.basketItemsSource.next(newItems);
  }
     
  getIngredientsForItem(salesItemId: number): Observable<IngredientSalesItemDetails[]> {
    return this.ingredientService.getIngredientsWithDetailsBySalesItemId(salesItemId).pipe(
      tap(items => console.log(`Received ingredient details for salesItemId=${salesItemId}:`, items)),
      catchError((error: any) => {
        console.error('Error fetching ingredient details', error);
        return throwError(error);
      })
    );

  }

  private toDetails(item: IngredientSalesItem): IngredientSalesItemDetails {
    return {
      salesItemId: item.salesItemId,
      ingredientId: item.ingredientId,
      min: item.min,
      max: item.max,
      count: item.count,
      ingredient: item.ingredient || defaultIngredient
    };
  }
   


  

 updateBasket(basketItem: BasketItem) {
    const currentBasketItems = this.basketItemsSource.value;
    this.basketItemsSource.next([...currentBasketItems, basketItem]);
  }





  removeFromBasket(itemId: number) {
    const currentBasketItems = this.basketItemsSource.value;
    const updatedBasketItems = currentBasketItems.filter(item => {
      if ('id' in item.item) {
        return item.item.id !== itemId;
      }
      return false; // Eller håndter SalesItemComposition anderledes
    });
    this.basketItemsSource.next(updatedBasketItems);
  }

  updateItemQuantity(itemId: number, quantity: number) {
    const currentBasketItems = this.basketItemsSource.value;
    const updatedBasketItems = currentBasketItems.map(item => {
      if ('id' in item.item && item.item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.basketItemsSource.next(updatedBasketItems);
  }

  addIngredientToBasketItem(basketItemId: number, ingredientId: number): void {
    const basketItem = this.findBasketItemById(basketItemId);
    if (basketItem) {
      let ingredient = basketItem.customizations?.find(ing => ing.ingredientId === ingredientId);
      if (ingredient && ingredient.count < ingredient.max) {
        ingredient.count++;
        this.calculateBasketItemPrice(basketItem); // Genberegner totalprisen
      }
    }
  }

  removeIngredientFromBasketItem(basketItemId: number, ingredientId: number): void {
    const basketItem = this.findBasketItemById(basketItemId);
    if (basketItem) {
      let ingredient = basketItem.customizations?.find(ing => ing.ingredientId === ingredientId);
      if (ingredient && ingredient.count > ingredient.min) {
        ingredient.count--;
        this.calculateBasketItemPrice(basketItem); // Genberegner totalprisen
      }
    }
  }
  calculateBasketItemPrice(basketItem: BasketItem): number {
    let basePrice = 0;

    // Tjek om basketItem.item er SalesItem eller SalesItemComposition
    if ('basePrice' in basketItem.item) {
      // For SalesItem, brug direkte basePrice
      basePrice = basketItem.item.basePrice;
    } else if ('parentItem' in basketItem.item && basketItem.item.parentItem) {
      // For SalesItemComposition, brug parentItem's basePrice
      basePrice = basketItem.item.parentItem.basePrice;
    }

    let totalPrice = basePrice;

    // Tilføj prisen for hver ingrediens til den samlede pris
    basketItem.customizations?.forEach(customization => {
      if (customization.ingredient && customization.ingredient.ingredientPrice) {
        const additionalPrice = customization.ingredient.ingredientPrice * customization.count;
        totalPrice += additionalPrice;
      }
    });

    return totalPrice;
  }

 

  addIngredientToBasketItemChild(childItemId: number, ingredientId: number): void {
    let basketItems = this.basketItemsSource.value;
    let isPriceUpdated = false;

    basketItems.forEach(basketItem => {
      if ('childItems' in basketItem.item && basketItem.item.childItems) {
        let childItem = basketItem.item.childItems.find(item => item.id === childItemId);
        if (childItem) {
          let ingredientDetail = childItem.ingredientSalesItems?.find(ing => ing.ingredientId === ingredientId);
          if (ingredientDetail && ingredientDetail.count < ingredientDetail.max) {
            ingredientDetail.count++;
            basketItem.totalPrice = this.calculateBasketItemPrice(basketItem); // Genberegner den samlede pris
            isPriceUpdated = true;
          }
        }
      }
    });

    if (isPriceUpdated) {
      this.basketItemsSource.next(basketItems); // Opdater kun hvis en ændring er foretaget
    }
  }


  removeIngredientFromBasketItemChild(childItemId: number, ingredientId: number): void {
    let basketItems = this.basketItemsSource.value;

    basketItems.forEach(basketItem => {
      if ('childItems' in basketItem.item && basketItem.item.childItems) {
        let childItem = basketItem.item.childItems.find(item => item.id === childItemId);
        if (childItem) {
          let ingredientDetail = childItem.ingredientSalesItems?.find(ing => ing.ingredientId === ingredientId);
          if (ingredientDetail && ingredientDetail.count > ingredientDetail.min) {
            ingredientDetail.count--;
          }
        }
      }
    });

    this.basketItemsSource.next(basketItems);
  }

  


  private findBasketItemById(basketItemId: number): BasketItem | undefined {
    return this.basketItemsSource.value.find(item =>
      'id' in item.item && item.item.id === basketItemId
    );
  }


  
  getTotalPrice(): number {
    return this.basketItemsSource.value.reduce((total, item) => total + item.totalPrice, 0);
  }

  clearBasket() {
    this.basketItemsSource.next([]);
  }

  // Yderligere metoder efter behov...
}



import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { BasketItem } from '../dtos/basket-item.dto';
import { SalesItem } from '../dtos/sales-item.dto';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';
import { SalesItemCompositionWithDetails } from '../dtos/sales-item-composition-with-details.dto';
import { IngredientSalesItem } from '../dtos/ingredient-sales-item.dto';
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
  compositionWithDetails?: SalesItemCompositionWithDetails;
  availableIngredients: { [childItemId: number]: IngredientSalesItemDetails[] } = {};
  constructor(

    private ingredientSalesItemService: IngredientSalesItemService,
    private ingredientService: IngredientService,
    private salesItemCompositionService: SalesItemCompositionService
  ) { }

  // Tilføj en SalesItem til kurven
  // Adjust the addToBasket method to handle Observable<number>

  addToBasket(item: BasketItem, additionalCustomizations?: IngredientSalesItem[]): void {
    const currentBasketItems = this.basketItemsSource.value;

    // Tilføj yderligere tilpasninger til item
    if (additionalCustomizations) {
      item.customizations = [...(item.customizations || []), ...additionalCustomizations];
    }

    // Genberegner totalprisen inklusive tilpasninger
    item.totalPrice = this.calculateBasketItemPrice(item);

    // Håndtering af SalesItemComposition
    if ('id' in item.item && item.item instanceof SalesItemComposition) {
      const compositionId = item.item.id;

      // Her bruger vi nu korrekt Observable med subscribe
      this.loadCompositionWithDetails(compositionId).subscribe((compositionDetails: SalesItemCompositionWithDetails) => {
        if (compositionDetails) {
          // Opdater item med kompositionsdetaljer
          item.item = compositionDetails;

          // For hvert childItem, indlæs tilgængelige ingredienser
          compositionDetails.childItems?.forEach(childItem => {
            this.loadAvailableIngredients(childItem.id);
          });
        }
      });
    }

    const updatedBasketItems = [...currentBasketItems, item];
    this.basketItemsSource.next(updatedBasketItems);
  }





  loadAvailableIngredients(salesItemId: number): void {
    this.ingredientService.getIngredientsWithDetailsBySalesItemId(salesItemId)
      .subscribe(
        ingredients => {
          console.log(`Ingredienser modtaget for salesItemId ${salesItemId}:`, ingredients);  // Log-udtalelse tilføjet
          const currentOptions = this.availableIngredientsSource.value;
          currentOptions[salesItemId] = ingredients;
          this.availableIngredientsSource.next(currentOptions);
        },
        error => {
          console.error('Error loading ingredients for salesItemId:', salesItemId, error);
          console.log(`Fejl ved indlæsning af ingredienser for salesItemId ${salesItemId}:`, error);  // Log-udtalelse tilføjet
        }
      );
  }
  loadCompositionWithDetails(parentItemId: number): Observable<SalesItemCompositionWithDetails> {
    return this.salesItemCompositionService.getCompositionWithDetails(parentItemId)
      .pipe(
        tap((compositionDetails) => {
          console.log(`Kompositionsdetaljer modtaget for parentItemId ${parentItemId}:`, compositionDetails);
          if (compositionDetails) {
            compositionDetails.childItems?.forEach(childItem => {
              this.loadAvailableIngredients(childItem.id);
            });
          } else {
            console.error('Composition details are missing');
          }
        }),
        catchError(error => {
          console.error('Error fetching composition details', error);
          console.log(`Fejl ved indhentning af kompositionsdetaljer for parentItemId ${parentItemId}:`, error);
          return throwError(() => new Error('Error fetching composition details'));
        })
      );
  }

  loadAvailableIngredientsForComposition(compositionDetails: SalesItemCompositionWithDetails): void {
    compositionDetails.childItems?.forEach(childItem => {
      this.ingredientService.getIngredientsWithDetailsBySalesItemId(childItem.id).subscribe(
        ingredients => {
          console.log(`Ingredienser for childItem ${childItem.id} modtaget:`, ingredients);
          this.availableIngredients[childItem.id] = ingredients.map(ingredient => ({
            ...ingredient,
            count: 0
          }));
        },
        error => {
          console.error(`Error loading ingredients for childItem ${childItem.id}`, error);
          console.log(`Fejl ved indlæsning af ingredienser for childItem ${childItem.id}:`, error);
        }
      );
    });
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
      standardCount: item.standardCount,
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
      if (ingredient) {
        // Tillader at reducere antallet yderligere, muligvis til under standardantal
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

    // Tilføj prisen for ekstra ingredienser til den samlede pris
    basketItem.customizations?.forEach(customization => {
      console.log('Customization:', customization);
      if (customization.ingredient && customization.ingredient.ingredientPrice) {
        const standardCount = customization.standardCount || 0;
        const extraCount = customization.count - standardCount;
        console.log('Extra count:', extraCount);

        if (extraCount > 0) {
          const additionalPrice = customization.ingredient.ingredientPrice * extraCount;
          console.log('Additional price:', additionalPrice);
          totalPrice += additionalPrice;
        }
      }
    });
    console.log('Total price:', totalPrice);

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
          if (ingredientDetail) {
            // Tillader at reducere antallet yderligere, muligvis til under standardantal
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



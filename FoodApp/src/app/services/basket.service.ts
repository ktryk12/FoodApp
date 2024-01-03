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
    // Beregn totalprisen for det tilføjede item
    const totalPrice = this.calculateTotalPrice(item.item, item.quantity, item.customizations);
    item.totalPrice = totalPrice;
    const updatedBasketItems = [...currentBasketItems, item];
    this.basketItemsSource.next(updatedBasketItems);
    console.log('Basket updated with new item:', item);
  }

  // Metode til at beregne totalprisen
  private calculateTotalPrice(item: SalesItem | SalesItemComposition, quantity: number, customizations?: IngredientSalesItem[]): number {
    let totalPrice = 0;
    totalPrice += ('basePrice' in item ? item.basePrice : 0) * quantity;
    customizations?.forEach(customization => {
      totalPrice += (customization.ingredient?.ingredientPrice || 0) * customization.count * quantity;
    });
    return totalPrice;
  }

  private compositionDetailsCache: { [id: number]: SalesItemCompositionWithDetails } = {};

  getCompositionDetailsAndAddToBasket(parentItemId: number, quantity: number, customizations?: IngredientSalesItem[]) {
    this.salesItemCompositionService.getCompositionWithDetails(parentItemId).subscribe(
      compositionDetails => {
        console.log('Received composition details:', compositionDetails);

        // Opret et BasketItem-objekt
        const basketItem: BasketItem = {
          item: compositionDetails,
          quantity: quantity,
          customizations: customizations,
          totalPrice: 0 // Denne værdi vil blive beregnet i addToBasket-metoden
        };

        // Tilføj BasketItem til kurven
        this.addToBasket(basketItem);
      },
      error => {
        console.error('Error fetching composition details', error);
      }
    );
  }


  // Adjusted to handle both SalesItem and SalesItemComposition
  private calculateItemPrice(item: SalesItem | SalesItemComposition, quantity: number, customizations?: IngredientSalesItem[]): Observable<number> {
    let price = 0;
    if (item instanceof SalesItem) {
      price = item.basePrice * quantity;
      customizations?.forEach(customization => {
        if (customization.ingredient) {
          price += customization.ingredient.ingredientPrice * (customization.count || 0);
        }
      });
    } else if (item instanceof SalesItemComposition && item.parentItem) {
      price = item.parentItem.basePrice * quantity;
      // Add logic here to handle price calculations for SalesItemComposition
    }
    // Add additional logic if needed
    return of(price);
  }

 

  // Method to add customizations to a child item within a SalesItemComposition
  addIngredientToChildItem(compositionId: number, childItemId: number, ingredientId: number, delta: number): void {
    let basketItems = this.basketItemsSource.value;

    // Find the parent composition item in the basket
    let parentIndex = basketItems.findIndex(item =>
      item.item instanceof SalesItemComposition &&
      item.item.parentItemId === compositionId
    );

    if (parentIndex !== -1) {
      let parentItem = basketItems[parentIndex].item as SalesItemComposition;

      // Ensure that childItems is initialized
      if (!parentItem.childItems) {
        parentItem.childItems = [];
      }

      // Find the child item within the composition
      let childItemIndex = parentItem.childItems.findIndex(item => item.id === childItemId);

      if (childItemIndex !== -1) {
        let childItem = parentItem.childItems[childItemIndex];

        // Ensure that ingredientSalesItems is initialized
        if (!childItem.ingredientSalesItems) {
          childItem.ingredientSalesItems = [];
        }

        // Check if the ingredient already exists
        let ingredientIndex = childItem.ingredientSalesItems.findIndex(i => i.ingredientId === ingredientId);

        if (ingredientIndex !== -1) {
          // Update existing ingredient quantity
          childItem.ingredientSalesItems[ingredientIndex].count += delta;
        } else {
          // Add new ingredient
          let newIngredientSalesItem: IngredientSalesItem = {
            salesItemId: childItemId,
            ingredientId: ingredientId,
            min: 0,
            max: 0,
            count: delta,
            ingredient: undefined // eller hent ingrediensens detaljer
          };

          childItem.ingredientSalesItems.push(newIngredientSalesItem);
        }

        // Update child item in parent composition
        parentItem.childItems[childItemIndex] = childItem;

        // Update parent item in the basket
        let updatedBasketItems = [...basketItems];
        updatedBasketItems[parentIndex].item = parentItem;

        // Update the basket items in the BehaviorSubject
        this.basketItemsSource.next(updatedBasketItems);

        // Now recalculate the price for the entire basket item if necessary
        // ...
      }
    }
  }

  // This method updates the entire basket with a new array of BasketItems.
  public updateBasketItems(newItems: BasketItem[]): void {
    this.basketItemsSource.next(newItems);
  }

  


 
  // Opdater totalprisen for et BasketItem
  private updateTotalPriceForBasketItem(basketItem: BasketItem): void {
    this.calculateItemPrice(basketItem.item, basketItem.quantity, basketItem.customizations).subscribe(
      newPrice => {
        // Update the total price of the basket item
        basketItem.totalPrice = newPrice;
        // Update the basket items in the BehaviorSubject
        this.updateBasketItems([...this.basketItemsSource.value]);
      },
      error => console.error('Error updating total price', error)
    );
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

  customizeItem(salesItemId: number, customizations: IngredientSalesItem[]) {
    const currentBasketItems = this.basketItemsSource.value;
    const updatedBasketItems = currentBasketItems.map(item => {
      if ('id' in item.item && item.item.id === salesItemId) {
        return { ...item, customizations };
      }
      return item;
    });
    this.basketItemsSource.next(updatedBasketItems);
  }

  addCustomization(salesItemId: number, customization: IngredientSalesItem): void {
    const currentBasketItems = this.basketItemsSource.value;
    // Find index af det eksisterende basketItem
    const index = currentBasketItems.findIndex(item => 'id' in item.item && item.item.id === salesItemId);

    if (index === -1) {
      console.error('Basket item not found');
      return;
    }

    // Kopier det eksisterende basketItem for at ændre det
    let basketItemToUpdate = { ...currentBasketItems[index] };
    basketItemToUpdate.customizations = [...(basketItemToUpdate.customizations || []), customization];

    this.calculateTotalPriceForItem(basketItemToUpdate).subscribe(newPrice => {
      // Opdater kun prisen i det kopierede basketItem
      basketItemToUpdate.totalPrice = newPrice;
      // Nu opdaterer vi den oprindelige liste med den opdaterede version af basketItem
      const updatedBasketItems = currentBasketItems.map((item, itemIndex) =>
        index === itemIndex ? basketItemToUpdate : item
      );
      // Og nu opdaterer vi 'basketItemsSource' med den nye liste
      this.basketItemsSource.next(updatedBasketItems);
    });
  }


  

  updateCustomizations(salesItemId: number, updatedCustomizations: IngredientSalesItem[]): void {
    const currentBasketItems = this.basketItemsSource.value;
    const updatedBasketItems = currentBasketItems.map(item => {
      if ('id' in item.item && item.item.id === salesItemId) {
        this.calculateTotalPriceForItem({ ...item, customizations: updatedCustomizations }).subscribe(updatedPrice => {
          item.totalPrice = updatedPrice;
        });
        return { ...item, customizations: updatedCustomizations };
      }
      return item;
    });
    this.basketItemsSource.next(updatedBasketItems);
  }

  calculateTotalPriceForItem(basketItem: BasketItem): Observable<number> {
    // Tjek om item er en SalesItem med ingredienser
    if ('ingredientSalesItems' in basketItem.item) {
      const salesItem = basketItem.item as SalesItem; // Type assertion, da vi ved at SalesItem har en 'id'
      const ingredientQuantities = basketItem.customizations?.reduce((acc, curr) => {
        acc[curr.ingredientId] = (acc[curr.ingredientId] || 0) + curr.count;
        return acc;
      }, {} as { [ingredientId: number]: number });

      return this.pricingService.calculatePriceWithIngredients(salesItem.id, ingredientQuantities || {});
    } else if ('id' in basketItem.item) {
      // Hvis det er en SalesItemComposition, så hent den tilhørende SalesItem for at få ID'en
      return this.pricingService.calculatePrice(basketItem.item.id);
    } else {
      // Hvis vi ikke kan finde en 'id', så kast en fejl eller håndter det som ønsket
      return throwError('Item has no identifiable ID for price calculation.');
    }
  }



  getTotalPrice(): number {
    return this.basketItemsSource.value.reduce((total, item) => total + item.totalPrice, 0);
  }

  clearBasket() {
    this.basketItemsSource.next([]);
  }

  // Yderligere metoder efter behov...
}



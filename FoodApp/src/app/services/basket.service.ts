import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { BasketItem } from '../dtos/basket-item.dto';
import { IngredientSalesItem } from '../dtos/ingredient-sales-item.dto';
import { IngredientSalesItemDetails } from '../dtos/ingredient-sales-item-details.dto';
import { Ingredient } from '../dtos/ingredient.dto';

const defaultIngredient: IngredientSalesItemDetails = {
  // Sæt standardværdierne for din defaultIngredient her
  salesItemId: 0,
  ingredientId: 0,
  min: 0,
  max: 0,
  count: 0,
  standardCount: 0,
  ingredient: {
    id: 0,
    name: 'Standard Ingredient',
    imageUrl: 'default-image-url',
    ingredientPrice: 0
  }
};



@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private basketItemsSource = new BehaviorSubject<BasketItem[]>([]);
  public basketItems$ = this.basketItemsSource.asObservable();
  

  constructor(

   
  ) { }
  

  // Tilføj en SalesItem til kurven
  // Adjust the addToBasket method to handle Observable<number>
  addToBasket(item: BasketItem, additionalCustomizations?: IngredientSalesItem[]): void {
    const currentBasketItems = this.basketItemsSource.value;

    console.log('Current basket items before adding:', currentBasketItems);

    // Opret en kopi af item
    const itemCopy: BasketItem = { ...item };

    // Tilføj yderligere tilpasninger til itemCopy
    if (additionalCustomizations) {
      if (!itemCopy.customizations) {
        itemCopy.customizations = [];
      }
      itemCopy.customizations.push(...additionalCustomizations);
      console.log('Adding customizations:', additionalCustomizations);
    }

    // Genberegner totalprisen inklusive tilpasninger
    itemCopy.totalPrice = this.calculateBasketItemPrice(itemCopy);
    console.log('Updated item with customizations:', itemCopy);

    // Opdaterer basketItems med den nye vare
    this.basketItemsSource.next([...currentBasketItems, itemCopy]);
    console.log('Updated basket items after adding:', this.basketItemsSource.value);
  }



  
   // This method updates the entire basket with a new array of BasketItems.
  public updateBasketItems(newItems: BasketItem[]): void {
    this.basketItemsSource.next(newItems);
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
    console.log(`addIngredientToBasketItem: basketItemId=${basketItemId}, ingredientId=${ingredientId}`);

    const basketItem = this.findBasketItemById(basketItemId);
    if (basketItem) {
      if (!basketItem.customizations) {
        basketItem.customizations = [];
      }
      let ingredient = basketItem.customizations.find(ing => ing.ingredientId === ingredientId);
      console.log('Found ingredient before increment:', ingredient);

      if (ingredient && ingredient.count < ingredient.max) {
        ingredient.count++;
        console.log('Updated ingredient count:', ingredient.count);

        this.calculateBasketItemPrice(basketItem); // Genberegner totalprisen
      }
    }
  }

  removeIngredientFromBasketItem(basketItemId: number, ingredientId: number): void {
    console.log(`removeIngredientFromBasketItem: basketItemId=${basketItemId}, ingredientId=${ingredientId}`);

    const basketItem = this.findBasketItemById(basketItemId);
    if (basketItem && basketItem.customizations) {
      // Find ingrediensen i customizations-arrayet
      const ingredientIndex = basketItem.customizations.findIndex(ing => ing.ingredientId === ingredientId);

      if (ingredientIndex !== -1) {
        const ingredient = basketItem.customizations[ingredientIndex];
        console.log('Found ingredient before decrement:', ingredient);

        // Tillader at reducere antallet yderligere, muligvis til under standardantal
        if (ingredient.count > 0) {
          ingredient.count--;
          console.log('Updated ingredient count:', ingredient.count);

          this.calculateBasketItemPrice(basketItem); // Genberegner totalprisen
        }

        // Fjern ingrediensen, hvis count er 0
        if (ingredient.count === 0) {
          basketItem.customizations.splice(ingredientIndex, 1);
        }
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



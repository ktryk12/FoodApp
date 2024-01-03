import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BasketService } from '../services/basket.service';
import { BasketItem } from '../dtos/basket-item.dto'; // Importér IngredientSalesItem og IngredientSalesItemDetails herfra
import { IngredientSalesItem } from '../dtos/ingredient-sales-item.dto';
import { IngredientSalesItemDetails } from '../dtos/ingredient-sales-item-details.dto';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';
import { SalesItem } from '../dtos/sales-item.dto';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  basketItems: BasketItem[] = [];
  selectedBasketItem: BasketItem | null = null;
  availableIngredients: { [childItemId: number]: IngredientSalesItemDetails[] } = {};
  selectedCompositionId?: number;   // ID for den valgte parent item (SalesItemComposition)
  selectedChildItemId?: number;     // ID for det valgte child item
  selectedIngredientId?: number;    // ID for den valgte ingrediens
  ingredientCount?: number;         // Mængden af ingrediensen

  constructor(private basketService: BasketService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.basketService.basketItems$.subscribe(items => {
      this.basketItems = items;
      // Dette vil tvinge UI'et til at opdatere, når listen opdateres
      this.cdr.detectChanges();
    });
  }
 

  getItemName(basketItem: BasketItem): string {
    if ('name' in basketItem.item) {
      return basketItem.item.name; // For SalesItem
    } else if (basketItem.item.parentItem) {
      return basketItem.item.parentItem.name; // For SalesItemComposition
    }
    return 'Ukendt Item';
  }

  onSelectItem(basketItem: BasketItem): void {
    this.selectedBasketItem = basketItem;

    if (this.isSalesItemComposition(basketItem.item)) {
      const composition = basketItem.item as SalesItemComposition;
      console.log('Selected composition:', composition);

      if (composition.parentItem && typeof composition.parentItem.id === 'number') {
        this.loadDetailsForComposition(composition);
      } else {
        console.error('parentItem or parentItem.id is undefined or not a number', composition);
      }
    } else if ('id' in basketItem.item) {
      const salesItem = basketItem.item as SalesItem;
      this.loadIngredientDetails(salesItem.id);
      console.log('Current available ingredients after selecting an item:', this.availableIngredients);
    }
  }




  loadIngredientDetails(salesItemId: number): void {
    this.basketService.getIngredientsForItem(salesItemId).subscribe(
      ingredientDetails => {
        console.log('Loaded ingredients for SalesItem ID:', salesItemId, ingredientDetails);
        this.availableIngredients[salesItemId] = ingredientDetails;
        this.cdr.detectChanges(); // Forsikrer, at Angular genkender tilstandsændringen
      },
      error => console.error('Error fetching ingredient details for item ID', salesItemId, error)
    );
  }

  loadDetailsForComposition(composition: SalesItemComposition): void {
    if (composition.childItems) {
      composition.childItems.forEach(childItem => {
        this.loadIngredientDetails(childItem.id);
      });
    }
    this.cdr.detectChanges();
  }

  // Metode til at tilføje en ingrediens til et SalesItem
  addIngredientToSalesItem(salesItemId: number, ingredientId: number): void {
    const basketItem = this.basketItems.find(item => this.isSalesItem(item.item) && item.item.id === salesItemId);

    if (basketItem && this.isSalesItem(basketItem.item)) {
      // Sikre at ingredientSalesItems eksisterer
      basketItem.item.ingredientSalesItems = basketItem.item.ingredientSalesItems || [];
      // Find og tilføj ingrediens
      const ingredientToAdd = this.availableIngredients[salesItemId]?.find(ing => ing.ingredientId === ingredientId);
      if (ingredientToAdd) {
        basketItem.item.ingredientSalesItems.push(ingredientToAdd);
      }
      // Opdater totalPrice
      basketItem.totalPrice = this.calculateTotalPriceForBasketItem(basketItem); // Sørg for at denne metode returnerer en 'number'
    }
  }

  // Hjælpefunktion til at beregne den samlede pris for et BasketItem
  calculateTotalPriceForBasketItem(basketItem: BasketItem): number {
    if (!basketItem) return 0;

    let totalPrice = 0;

    // Tjek om basketItem indeholder en SalesItem
    if (this.isSalesItem(basketItem.item)) {
      // Beregn pris for SalesItem
      totalPrice = basketItem.item.basePrice;
      basketItem.item.ingredientSalesItems?.forEach(ingredientItem => {
        totalPrice += ingredientItem.count * (ingredientItem.ingredient?.ingredientPrice || 0);
      });
    }
    // Tjek om basketItem indeholder en SalesItemComposition
    else if (this.isSalesItemComposition(basketItem.item)) {
      // Beregn pris for SalesItemComposition
      totalPrice += basketItem.item.parentItem?.basePrice || 0;
      basketItem.item.childItems?.forEach(childItem => {
        childItem.ingredientSalesItems?.forEach(ingredientItem => {
          totalPrice += ingredientItem.count * (ingredientItem.ingredient?.ingredientPrice || 0);
        });
      });
    }

    basketItem.totalPrice = totalPrice;
    return totalPrice;
  }

  // Metode til at tilføje en ingrediens til et ChildItem
  addIngredientToChildItem(parentCompositionId: number, childItemId: number, ingredientId: number): void {
    const basketItem = this.basketItems.find(item =>
      this.isSalesItemComposition(item.item) && item.item.parentItem && item.item.parentItem.id === parentCompositionId);

    if (!basketItem || !this.isSalesItemComposition(basketItem.item) || !basketItem.item.childItems) {
      console.error('BasketItem for SalesItemComposition ikke fundet eller er ikke korrekt type');
      return;
    }

    const childItem = basketItem.item.childItems.find(child => child.id === childItemId);
    if (!childItem) {
      console.error('ChildItem ikke fundet');
      return;
    }

    const ingredientToAdd = this.availableIngredients[childItemId]?.find(ing => ing.ingredientId === ingredientId);
    if (!ingredientToAdd) {
      console.error('Ingrediens ikke fundet');
      return;
    }

    childItem.ingredientSalesItems = childItem.ingredientSalesItems || [];
    childItem.ingredientSalesItems.push(ingredientToAdd);

    this.calculateTotalPriceForBasketItem(basketItem);
    // Antager at `updateBasket` er en metode, der opdaterer basket med det givne basketItem
    this.updateBasket(basketItem);
  }


  

  // Opdater BasketItem i basketItems
  updateBasket(updatedBasketItem: BasketItem): void {
    const index = this.basketItems.findIndex(item => item === updatedBasketItem);
    if (index !== -1) {
      this.basketItems[index] = updatedBasketItem;
      this.cdr.detectChanges(); // Opdater UI
    }
  }

  removeIngredientFromSalesItem(salesItemId: number, ingredientId: number): void {
    const salesItem = this.findSalesItemById(salesItemId);

    if (salesItem && salesItem.ingredientSalesItems) {
      const ingredientIndex = salesItem.ingredientSalesItems.findIndex(ingredient => ingredient.ingredientId === ingredientId);

      if (ingredientIndex !== -1) {
        // Reducer antallet, eller fjern ingrediensen helt
        if (salesItem.ingredientSalesItems[ingredientIndex].count > 1) {
          salesItem.ingredientSalesItems[ingredientIndex].count -= 1;
        } else {
          salesItem.ingredientSalesItems.splice(ingredientIndex, 1);
        }
        this.updateSalesItemInBasket(salesItemId, salesItem);
      }
    }
  }

  private findSalesItemById(salesItemId: number): SalesItem | undefined {
    return this.basketItems.find(item => this.isSalesItem(item.item) && item.item.id === salesItemId)?.item as SalesItem;
  }

  private updateBasketItemInBasket(updatedItem: SalesItem | SalesItemComposition): void {
    this.basketItems.forEach(basketItem => {
      if (this.isSalesItem(basketItem.item) && updatedItem instanceof SalesItem && basketItem.item.id === updatedItem.id) {
        // Opdaterer SalesItem
        basketItem.item = updatedItem;
      } else if (this.isSalesItemComposition(basketItem.item) && updatedItem instanceof SalesItemComposition) {
        // Opdaterer SalesItemComposition
        if (basketItem.item.parentItem?.id === updatedItem.parentItem?.id) {
          basketItem.item = updatedItem;
        }
      }
    });

    this.cdr.detectChanges();
  }


    
  private updateSalesItemInBasket(salesItemId: number, updatedSalesItem: SalesItem): void {
    // Find index for det relevante SalesItem i basketItems
    const index = this.basketItems.findIndex(item => this.isSalesItem(item.item) && item.item.id === salesItemId);

    if (index !== -1) {
      // Opdater SalesItem i basketItems
      this.basketItems[index].item = updatedSalesItem;
      // Opdater ChangeDetectorRef
      this.cdr.detectChanges();
    }
  }

  removeIngredientFromChildItem(childItemId: number, ingredientId: number): void {
    this.basketItems.forEach(basketItem => {
      if (this.isSalesItemComposition(basketItem.item)) {
        const composition = basketItem.item as SalesItemComposition;
        const childItem = composition.childItems?.find(item => item.id === childItemId);

        if (childItem && childItem.ingredientSalesItems) {
          const ingredientIndex = childItem.ingredientSalesItems.findIndex(ingredient => ingredient.ingredientId === ingredientId);

          if (ingredientIndex !== -1) {
            // Reducer antallet, eller fjern ingrediensen helt
            if (childItem.ingredientSalesItems[ingredientIndex].count > 1) {
              childItem.ingredientSalesItems[ingredientIndex].count -= 1;
            } else {
              childItem.ingredientSalesItems.splice(ingredientIndex, 1);
            }

            // Opdaterer den samlede pris for composition, hvis nødvendigt
            // Her antager vi, at du har en metode til at gøre dette
            // this.calculateTotalPriceForComposition(composition);

            this.updateBasketItemInBasket(composition);
          }
        }
      }
    });
  }

 
// Call these methods with the correct parameters from your templat

  getFullImagePath(relativePath: string | undefined): string {
    return relativePath ? `https://localhost:7218${relativePath}` : '';
  }
  
  isSalesItem(item: SalesItem | SalesItemComposition): item is SalesItem {
    return !!(item as SalesItem).imageUrl; // Adjust the condition as needed
  }

  isSalesItemComposition(item: SalesItem | SalesItemComposition): item is SalesItemComposition {
    return !!(item as SalesItemComposition).parentItem !== undefined;
  }

  // Offentlig wrapper-funktion for at få den samlede pris
  getTotalPrice(): number {
    return this.basketService.getTotalPrice();
  }
  // Metode til at tilføje en tilpasning til et item
  addCustomizationToItem(itemId: number, customization: IngredientSalesItem) {
    this.basketService.addCustomization(itemId, customization);
  }

  // Metode til at opdatere tilpasninger for et item
  updateItemCustomizations(itemId: number, customizations: IngredientSalesItem[]) {
    this.basketService.updateCustomizations(itemId, customizations);
  }
  // Offentlig wrapper-funktion for at tømme kurven
  clearBasket(): void {
    this.basketService.clearBasket();
  }


  // Resten af din kode...
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BasketService } from '../services/basket.service';
import { BasketItem } from '../dtos/basket-item.dto';
import { combineLatest } from 'rxjs';
import { IngredientSalesItemDetails } from '../dtos/ingredient-sales-item-details.dto';
import { SalesItemCompositionWithDetails } from '../dtos/sales-item-composition-with-details.dto';
import { SalesItem } from '../dtos/sales-item.dto';
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

  constructor(private basketService: BasketService, private cdr: ChangeDetectorRef) { }

  
    ngOnInit(): void {
      this.basketService.basketItems$.subscribe(basketItems => {
        this.basketItems = basketItems;
        this.cdr.detectChanges();
      });

   

    // Abonner på compositionDetails for at håndtere yderligere logik
    this.basketService.compositionDetails$.subscribe(compositionDetails => {
      if (compositionDetails) {
        // Implementér relevante handlinger her
      } else {
        // Håndter ingen sammensætningsdetaljer
      }
    });
  }

  

  onSelectItem(basketItem: BasketItem): void {
    this.selectedBasketItem = basketItem;

    // Hvis det er en SalesItem, hent ingredienserne direkte
    if ('id' in basketItem.item) {
      this.basketService.loadAvailableIngredients(basketItem.item.id);
    }
    // Hvis det er en SalesItemComposition, hent ingredienserne for hvert child item
    else if (basketItem.item.childItems) {
      basketItem.item.childItems.forEach(childItem => {
        this.basketService.loadAvailableIngredients(childItem.id);
      });
    }
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

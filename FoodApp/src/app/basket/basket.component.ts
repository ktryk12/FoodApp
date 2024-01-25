import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BasketService } from '../services/basket.service';
import { BasketItem } from '../dtos/basket-item.dto';
import { Subscription } from 'rxjs';
import { ItemDetailsService } from '../services/item-details.service';
import { SalesItemCompositionWithDetails } from '../dtos/sales-item-composition-with-details.dto';
import { IngredientSalesItemDetails } from '../dtos/ingredient-sales-item-details.dto';
import { SalesItem } from '../dtos/sales-item.dto';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})


export class BasketComponent implements  OnDestroy {
  basketItems: BasketItem[] = [];
  availableIngredients: { [salesItemId: number]: IngredientSalesItemDetails[] } = {};
  private subscriptions = new Subscription();

  constructor(
    private basketService: BasketService,
    private cdr: ChangeDetectorRef,
    private itemDetailsService: ItemDetailsService
  ) { }
  ngOnInit(): void {
    this.subscriptions.add(
      this.basketService.basketItems$.subscribe(basketItems => {
        this.basketItems = basketItems;
        basketItems.forEach(item => {
          if (this.isSalesItem(item.item)) {
            this.loadAvailableIngredientsForSalesItem(item.item.id);
          } else if (this.isSalesItemComposition(item.item)) {
            // Her antages det, at parentItemId findes for sammensatte items
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

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.basketService.basketItems$.subscribe(basketItems => {
        this.basketItems = basketItems;
        basketItems.forEach(item => {
          if (this.isSalesItem(item.item)) {
            this.loadAvailableIngredientsForSalesItem(item.item.id);
          } else if (this.isSalesItemComposition(item.item)) {
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


 
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCompositionWithDetails(parentItemId: number): void {
    this.itemDetailsService.getSalesItemCompositionDetails(parentItemId).subscribe(
      (compositionDetails) => {
        if (compositionDetails) {
          this.loadAvailableIngredientsForComposition(compositionDetails);
        }
      },
      error => console.error('Error fetching composition details', error)
    );
  }

  loadAvailableIngredientsForSalesItem(salesItemId: number): void {
    this.itemDetailsService.getIngredientsForItem(salesItemId).subscribe(
      ingredients => {
        this.availableIngredients[salesItemId] = ingredients;
      },
      error => console.error('Error loading ingredients', error)
    );
  }

  loadAvailableIngredientsForComposition(compositionDetails: SalesItemCompositionWithDetails): void {
    compositionDetails.childItems?.forEach(childItem => {
      this.itemDetailsService.getIngredientsForItem(childItem.id).subscribe(
        ingredients => {
          this.availableIngredients[childItem.id] = ingredients;
        },
        error => console.error(`Error loading ingredients for childItem ${childItem.id}`, error)
      );
    });
  }

  isSalesItem(item: SalesItem | SalesItemComposition): item is SalesItem {
    // Et SalesItem betragtes som enkeltstående, hvis isComposite er false
    return (item as SalesItem).isComposite === false;
  }

  isSalesItemComposition(item: SalesItem | SalesItemComposition): item is SalesItemComposition {
    // Et SalesItemComposition betragtes som sammensat, hvis isComposite er true
    return (item as SalesItem).isComposite === true;
  }


  onAddIngredientToChild(childItemId: number, ingredientId: number): void {
    this.basketService.addIngredientToBasketItemChild(childItemId, ingredientId);
  }

  onRemoveIngredientFromChild(childItemId: number, ingredientId: number): void {
    this.basketService.removeIngredientFromBasketItemChild(childItemId, ingredientId);
  }

  

  addIngredient(basketItemId: number, ingredientId: number): void {
    console.log(`  addIngredient called: basketItemId=${basketItemId}, ingredientId=${ingredientId}`);
    this.basketService.addIngredientToBasketItem(basketItemId, ingredientId);
    this.updateLocalBasketItemsState();
  }

  removeIngredient(basketItemId: number, ingredientId: number): void {
    console.log(`removeIngredient called: basketItemId=${basketItemId}, ingredientId=${ingredientId}`);
    this.basketService.removeIngredientFromBasketItem(basketItemId, ingredientId);
    this.updateLocalBasketItemsState();
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
  updateLocalBasketItemsState(): void {
    // Få den seneste tilstand af basketItems fra BasketService
    this.basketService.basketItems$.subscribe(updatedItems => {
      this.basketItems = updatedItems;
      this.cdr.detectChanges(); // Opdater view, hvis nødvendigt
    });
  }

  
  
  getTotalPrice(): number {
    return this.basketService.getTotalPrice();
  }

  clearBasket(): void {
    this.basketService.clearBasket();
  }

  // Andre nødvendige metoder...
}

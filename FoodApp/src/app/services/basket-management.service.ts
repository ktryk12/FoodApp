// basket-management.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { BasketItem } from '../dtos/basket-item.dto';
import { SalesItemService } from './sales-item.service';
import { IngredientSalesItemService } from './ingredient-sales-item.service';
import { SalesItemCompositionService } from './sales-item-composition.service';
import { BasketUtilsService } from './basket-utils.service';



@Injectable({
  providedIn: 'root'
})
export class BasketManagementService {
  private basketItemsSource = new BehaviorSubject<BasketItem[]>([]);
  onBasketItemAdded = new EventEmitter<BasketItem>();
  constructor(
    private salesItemService: SalesItemService,
    private ingredientSalesItemService: IngredientSalesItemService,
    private basketUtilsService: BasketUtilsService,
    private salesItemCompositionService: SalesItemCompositionService

  ) { }

  

  addItem(salesItemId: number, quantity: number): void {
    this.salesItemService.getSalesItemById(salesItemId).subscribe(salesItem => {
      const newItem = new BasketItem(salesItemId, quantity, salesItem);
      this.basketUtilsService.updateBasketItem(newItem);
      this.onBasketItemAdded.emit(newItem);
    });
  }

  addCompositeItem(parentItemId: number, quantity: number): void {
    this.salesItemCompositionService.getCompositionsByParentItemId(parentItemId).subscribe(compositions => {
      if (compositions.length === 0) {
        console.error('Ingen kompositioner fundet for parentItemId:', parentItemId);
        return;
      }

      const newItem = new BasketItem(parentItemId, quantity);
      // Bemærk: Vi tilføjer ikke ingredienser her, men sender begivenheden ud
      this.updateBasketItems(newItem);
      this.onBasketItemAdded.emit(newItem);
    });
  }

  updateBasketItems(newItem: BasketItem): void {
    this.basketUtilsService.updateBasketItem(newItem);
  }

  


  removeItem(itemId: number): void {
    const updatedItems = this.basketItemsSource.value.filter(item => item.id !== itemId);
    this.basketItemsSource.next(updatedItems);
  }
}

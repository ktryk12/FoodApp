import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BasketItem } from '../dtos/basket-item.dto';

@Injectable({ providedIn: 'root' })
  
export class BasketUtilsService {
  private basketItemsSource = new BehaviorSubject<BasketItem[]>([]);
  private basketItemAddedSource = new BehaviorSubject<BasketItem | null>(null);

  get basketItems$(): Observable<BasketItem[]> {
    return this.basketItemsSource.asObservable();
  }

  get basketItemAdded$(): Observable<BasketItem | null> {
    return this.basketItemAddedSource.asObservable();
  }

  updateBasketItem(updatedItem: BasketItem): void {
    const items = this.basketItemsSource.value;
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
    } else {
      items.push(updatedItem);
    }
    this.basketItemsSource.next(items);
    this.basketItemAddedSource.next(updatedItem); // Udsender en ny vare
  }


  findBasketItem(itemId: number): BasketItem | undefined {
    return this.basketItemsSource.value.find(item => item.id === itemId);
  }

  // Andre hjælpefunktioner...
}

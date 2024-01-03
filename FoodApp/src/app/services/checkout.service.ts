import { Injectable } from '@angular/core';
import { OrderService } from './order.service';
import { ShopService } from './shop.service';
import { ShopSelectionService } from './shop-selection.service';
import { IngredientOrderlineService } from './ingredient-orderline.service';
import { OrderlineService } from './orderline.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private orderService: OrderService,
    private shopService: ShopService,
    private shopSelectionService: ShopSelectionService,
    private ingredientOrderlineService: IngredientOrderlineService,
    private orderlineService: OrderlineService
  ) { }

  // Denne metode starter checkout processen og opretter en ny ordre
  createOrder(): Observable<CreateOrderResponse> {
    // Hent den valgte shopId fra ShopSelectionService
    return new Observable(subscriber => {
      this.shopSelectionService.getSelectedShopId().subscribe(shopId => {
        if (shopId) {
          // Brug OrderService til at oprette en ny ordre for den valgte shop
          this.orderService.createOrder(shopId).subscribe(
            orderResponse => {
              subscriber.next(orderResponse);
              subscriber.complete();
            },
            error => {
              console.error('Error when creating order:', error);
              subscriber.error(error);
            }
          );
        } else {
          subscriber.error(new Error('No shop selected'));
        }
      });
    });
  }

  // Metoder til at tilføje, opdatere og fjerne orderlines samt opdatere ordrens total kunne se sådan ud:
  addOrderlineToOrder(/* parameters */) {
    // Implementation...
  }

  updateOrderline(/* parameters */) {
    // Implementation...
  }

  removeOrderlineFromOrder(/* parameters */) {
    // Implementation...
  }

  updateOrderTotal(/* parameters */) {
    // Implementation...
  }

  // Denne metode kan håndtere betalingslogikken, hvis du har en sådan
  processPayment(/* parameters */) {
    // Implementation...
  }

  // Flere metoder som kræves for at fuldføre checkout-processen kan tilføjes her...
}

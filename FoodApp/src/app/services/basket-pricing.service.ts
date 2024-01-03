// basket-pricing.service.ts
import { Injectable } from '@angular/core';
import { BasketUtilsService} from './basket-utils.service';
import { BasketIngredientService } from './basket-ingredient.service';
import { PricingService } from './pricing.service';

@Injectable({
  providedIn: 'root'
})
export class BasketPricingService {
  constructor(
    private pricingService: PricingService,
    private basketUtilsService: BasketUtilsService,
    private basketIngredientService: BasketIngredientService
  ) { }

  updatePriceForItem(salesItemId: number): void {
    const basketItem = this.basketUtilsService.findBasketItem(salesItemId);
    if (!basketItem) return;

    this.pricingService.calculatePrice(salesItemId).subscribe(basePrice => {
      let totalPrice = basePrice;

      if (basketItem.ingredientSalesItems) {
        this.basketIngredientService.calculateTotalIngredientPrice(basketItem.ingredientSalesItems).then(ingredientPrice => {
          totalPrice += ingredientPrice;
          basketItem.price = totalPrice;
          this.basketUtilsService.updateBasketItem(basketItem);
        });
      } else {
        basketItem.price = totalPrice;
        this.basketUtilsService.updateBasketItem(basketItem);
      }
    });
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { ShopType } from '../dtos/shop.dto'; // Opdater stien efter behov

@Pipe({ name: 'enumToString' })
export class EnumToStringPipe implements PipeTransform {
  transform(value: any): string {
    switch (value) {
      case ShopType.Restaurant:
        return 'Restaurant';
      case ShopType.FoodStand:
        return 'Madbod';
      case ShopType.CandyStore:
        return 'Slikbutik';
      default:
        return 'Ukendt';
    }
  }
}

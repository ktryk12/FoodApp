import { SalesItem } from '../dtos/sales-item.dto';
import { IngredientSalesItem } from '../dtos/ingredient-sales-item.dto';
import { Ingredient } from '../dtos/ingredient.dto';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';
import { IngredientSalesItemDetails } from './ingredient-sales-item-details.dto';



export class BasketItem {
  item: SalesItem | SalesItemComposition; // Kan holde enten en SalesItem eller en SalesItemComposition
  quantity: number; // Antallet af dette item i kurven
  customizations?: IngredientSalesItem[]; // Liste over tilpasninger (ingredienser) for item
  totalPrice: number; // Samlet pris for item inklusive tilpasninger

  // Constructor til at initialisere værdier
  constructor(item: SalesItem | SalesItemComposition, quantity: number = 1, customizations: IngredientSalesItem[] = []) {
    this.item = item;
    this.quantity = quantity;
    this.customizations = customizations;
    this.totalPrice = 0; // Denne værdi skal beregnes baseret på item og tilpasninger
  }
}


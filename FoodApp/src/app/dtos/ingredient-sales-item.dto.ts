import { Ingredient } from './ingredient.dto';
import { SalesItem } from './sales-item.dto';

export class IngredientSalesItem {
  salesItemId!: number;
  ingredientId!: number;
  min!: number;
  max!: number;
  count!: number;
  standardCount!: number;
  ingredient?: Ingredient;
  salesItem?: SalesItem;
}

import { Ingredient } from '../dtos/ingredient.dto';
export interface IngredientSalesItemDetails {
  salesItemId: number;
  ingredientId: number;
  min: number;
  max: number;
  count: number;
  ingredient: Ingredient;
 
}

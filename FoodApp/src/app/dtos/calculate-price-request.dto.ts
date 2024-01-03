import { IngredientQuantities } from "./ingredient-quantities.dto";

export interface CalculatePriceRequest {
  salesItemId: number;
  ingredientQuantities: IngredientQuantities;
}

import { Ingredient } from "./ingredient.dto";


export interface IngredientSelection {
  ingredient: Ingredient;
  min: number;
  max: number;
  count: number;
}

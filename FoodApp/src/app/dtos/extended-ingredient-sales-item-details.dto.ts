import { IngredientSalesItemDetails } from "./ingredient-sales-item-details.dto";


export interface ExtendedIngredientSalesItemDetails extends IngredientSalesItemDetails {
  selected: boolean;
}

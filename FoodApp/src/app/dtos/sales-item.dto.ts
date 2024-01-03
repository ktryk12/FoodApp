import { IngredientSalesItem } from '../dtos/ingredient-sales-item.dto';

export class SalesItem {
  id!: number;
  name!: string;
  productNumber!: string;
  imageUrl!: string;
  basePrice!: number;
  category!: string;
  salesItemGroup!: number;
  isActive!: boolean;
  isComposite!: boolean
  ingredientSalesItems?: IngredientSalesItem[]
  customizations?: IngredientSalesItem[];
  
}

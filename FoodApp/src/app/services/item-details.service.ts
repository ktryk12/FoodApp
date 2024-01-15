import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesItemService } from './sales-item.service';
import { SalesItemCompositionService } from './sales-item-composition.service';
import { IngredientService } from './ingredient.service';
import { SalesItem } from '../dtos/sales-item.dto';
import { IngredientSalesItemDetails } from '../dtos/ingredient-sales-item-details.dto';
import { SalesItemCompositionWithDetails} from '../dtos/sales-item-composition-with-details.dto';

@Injectable({
  providedIn: 'root'
})
export class ItemDetailsService {

  constructor(
    private salesItemService: SalesItemService,
    private salesItemCompositionService: SalesItemCompositionService,
    private ingredientService: IngredientService
  ) { }

  // Hent detaljer for en SalesItem
  getSalesItemDetails(salesItemId: number): Observable<SalesItem> {
    return this.salesItemService.getSalesItemById(salesItemId);
  }

  // Hent detaljer for en SalesItemComposition
  getSalesItemCompositionDetails(parentItemId: number): Observable<SalesItemCompositionWithDetails> {
    return this.salesItemCompositionService.getCompositionWithDetails(parentItemId);
  }

  // Hent ingredienser for et SalesItem eller ChildItem af en SalesItemComposition
  getIngredientsForItem(salesItemId: number): Observable<IngredientSalesItemDetails[]> {
    return this.ingredientService.getIngredientsWithDetailsBySalesItemId(salesItemId);
  }

  // Tilføj yderligere metoder efter behov...
}

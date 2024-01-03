import { SalesItem } from '../dtos/sales-item.dto';
export class SalesItemComposition {
  parentItemId?: number;
  parentItem?: SalesItem; 
  childItemId?: number;
  childItem?: SalesItem;
  childItemIds?: number[];
  childItems?: SalesItem[];
  
}

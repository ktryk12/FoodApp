import { SalesItem } from './sales-item.dto';

export class SalesItemCompositionWithDetails {
  parentItem?: SalesItem;
  childItems?: SalesItem[];
}

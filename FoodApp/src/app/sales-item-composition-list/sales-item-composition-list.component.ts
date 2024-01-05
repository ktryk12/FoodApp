// I  Angular Component
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SalesItemService } from '../services/sales-item.service';
import { SalesItem } from '../dtos/sales-item.dto';
import { BasketService } from '../services/basket.service';
import { SalesItemCompositionService } from '../services/sales-item-composition.service';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';
import { BasketItem } from '../dtos/basket-item.dto';

@Component({
  selector: 'app-sales-item-composition-list',
  templateUrl: './sales-item-composition-list.component.html',
  styleUrls: ['./sales-item-composition-list.component.css']
})
export class SalesItemCompositionListComponent implements OnInit {
  salesItems: SalesItem[] = [];
  compositions: SalesItemComposition[] = [];
  isCompositeView: boolean = true; // Fokuserer på sammensatte items

  constructor(private salesItemService: SalesItemService,
    private router: Router,
    private basketService: BasketService,
    private salesItemCompositionService: SalesItemCompositionService
  ) { }

  ngOnInit(): void {
    this.loadSalesItems();
  }
  goToDetail(itemId: number): void {
    this.router.navigate(['/sales-item-composition-detail', itemId]);
  }
  loadSalesItems(): void {
    this.salesItemService.getSalesItemsByIsComposite(true).subscribe(
      (items) => {
        this.salesItems = items;
        this.salesItems.forEach(item => this.loadCompositions(item.id));
      },
      (error) => console.error('Error fetching sales items', error)
    );
  }
  getFullImagePath(relativePath: string | undefined): string {
    return relativePath ? `https://localhost:7218${relativePath}` : '';
  }

  loadCompositions(parentItemId: number): void {
    this.salesItemCompositionService.getCompositionsByParentItemId(parentItemId).subscribe(
      (compositions) => {
        this.compositions.push(...compositions);
      },
      (error) => {
        console.error('Error fetching compositions', error);
      }
    );
  }
  addToBasketWrapper(item: SalesItem | SalesItemComposition, quantity: number = 1) {
    const basketItem: BasketItem = {
      item: item,
      quantity: quantity,
      customizations: [], 
      totalPrice: 0 // Dette vil blive beregnet senere
    };
    this.basketService.addToBasket(basketItem);
    console.log('Item added to basket:', item);
  }
}




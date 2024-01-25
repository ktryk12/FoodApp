import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../services/shop.service';
import { SalesItemService } from '../services/sales-item.service';
import { BasketService } from '../services/basket.service';
import { Shop } from '../dtos/shop.dto';
import { SalesItem } from '../dtos/sales-item.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {
  shop: Shop | null = null;
  salesItems: SalesItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private salesItemService: SalesItemService,
    private basketService: BasketService
  ) { }

  ngOnInit(): void {
    this.loadShopDetails();
  }

  private loadShopDetails(): void {
    const shopId = this.route.snapshot.params['id'];
    this.shopService.getShop(shopId).subscribe({
      next: shop => {
        this.shop = shop;
        this.loadSalesItemsForShop(shop.id);
      },
      error: err => console.error('Error loading shop:', err)
    });
  }

  private loadSalesItemsForShop(shopId: number): void {
    this.shopService.getSalesItemIdsByShopId(shopId).subscribe({
      next: salesItemIds => {
        forkJoin(salesItemIds.map(id => this.salesItemService.getSalesItemById(id)))
          .subscribe(salesItems => {
            this.salesItems = salesItems;
            console.log('Sales Items loaded:', this.salesItems);
          },
            error => console.error('Error loading sales items:', error)
          );
      },
      error: err => console.error('Error loading sales item IDs for shop:', err)
    });
  }

  getFullImagePath(relativePath: string | undefined): string {
    return relativePath ? `https://localhost:7218${relativePath}` : '';
  }

  addSalesItemToBasket(salesItem: SalesItem): void {
    const basketItem = {
      item: salesItem,
      quantity: 1,
      totalPrice: salesItem.basePrice
    };

    this.basketService.addToBasket(basketItem);
  }
}

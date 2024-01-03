import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../services/shop.service';
import { SalesItemService } from '../services/sales-item.service';
import { SalesItemCompositionService } from '../services/sales-item-composition.service';
import { Shop } from '../dtos/shop.dto';
import { SalesItem } from '../dtos/sales-item.dto';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {
  shop: Shop | null = null;
  salesItems: SalesItem[] = [];
  compositions: SalesItemComposition[] = [];

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private salesItemService: SalesItemService,
    private compositionService: SalesItemCompositionService
  ) { }

  ngOnInit(): void {
    this.loadShopDetails();
  }

  private loadShopDetails(): void {
    const shopId = this.route.snapshot.params['id'];
    this.shopService.getShop(shopId).subscribe({
      next: shop => {
        this.shop = shop;
        this.loadSalesItems(shop.id);
        this.loadCompositions(shop.id);
      },
      error: err => console.error('Error loading shop:', err)
    });
  }

  private loadSalesItems(shopId: number): void {
    // Implementer logikken til at indlæse salgsartikler
    // Eksempel: this.salesItemService.getSalesItemsByShop(shopId).subscribe(...)
  }

  private loadCompositions(shopId: number): void {
    // Implementer logikken til at indlæse sammensætninger
    // Eksempel: this.compositionService.getCompositionsByShop(shopId).subscribe(...)
  }
}

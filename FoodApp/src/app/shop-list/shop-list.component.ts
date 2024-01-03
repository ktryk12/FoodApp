import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from '../services/shop.service';
import { Shop } from '../dtos/shop.dto';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent implements OnInit {
  shops: Shop[] = [];

  constructor(private shopService: ShopService, private router: Router) { }


  ngOnInit() {
    this.shopService.getAllShops().subscribe(data => {
      this.shops = data;
    });
  }
  navigateToShopDetails(shopId: number): void {
    this.router.navigate(['/shop-detail', shopId]);
  }
}


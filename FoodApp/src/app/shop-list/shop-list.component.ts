import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ShopService } from '../services/shop.service';
import { Shop } from '../dtos/shop.dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
  getFullImagePath(relativePath: string | undefined): string {
    return relativePath ? `https://localhost:7218${relativePath}` : '';
  }

}


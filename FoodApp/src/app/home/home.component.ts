import { Component, OnInit } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { Router } from '@angular/router';
import { Shop } from '../dtos/shop.dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  shops: Shop[] = [];

  constructor(private shopService: ShopService, private router: Router) { }

  ngOnInit(): void {
    this.fetchShops();
  }

  private fetchShops() {
    this.shopService.getAllShops().subscribe({
      next: (data) => {
        this.shops = data;
      },
      error: (error) => {
        console.error('Fejl under indlæsning af butikker', error);
      }
    });
  }

  navigateToShopDetails(shopId: number): void {
    this.router.navigate(['/shop-detail', shopId]);
  }
  
}



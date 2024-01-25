import { Component, OnInit } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { Router, RouterModule } from '@angular/router';
import { Shop } from '../dtos/shop.dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports:  [CommonModule, FormsModule, RouterModule],
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



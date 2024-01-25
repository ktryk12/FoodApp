import { Component, OnInit } from '@angular/core';
import { SalesItemService } from '../services/sales-item.service';
import { SalesItem } from '../dtos/sales-item.dto';
import { Router } from '@angular/router';
import { BasketService } from '../services/basket.service';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';
import { BasketItem } from '../dtos/basket-item.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-sales-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-item-list.component.html',
  styleUrls: ['./sales-item-list.component.css']
})
export class SalesItemListComponent implements OnInit {
  salesItems: SalesItem[] = [];

  constructor(private salesItemService: SalesItemService, private router: Router, private basketService: BasketService) { }

  ngOnInit(): void {
    this.salesItemService.getAllSalesItems().subscribe(
      (data) => {
        console.log(data); 
        this.salesItems = data;
      },
      (error) => {
        console.error('Error fetching sales items', error);
      }
    );
  }

  getFullImagePath(relativePath: string | undefined): string {
    return relativePath ? `https://localhost:7218${relativePath}` : '';
  }
  

  addToBasket(item: SalesItem | SalesItemComposition, quantity: number = 1) {
    // Opret et BasketItem-objekt med det valgte item og antal
    const basketItem: BasketItem = {
      item: item,
      quantity: quantity,
      customizations: [], // Du kan tilføje eventuelle tilpasninger her, hvis nødvendigt
      totalPrice: 0 // Initialiser totalPrice, som vil blive beregnet i BasketService
    };

    // Tilføj BasketItem til kurven
    this.basketService.addToBasket(basketItem);

    // Log den tilføjede vare
    console.log('Item added to basket:', item);
  }

  

}

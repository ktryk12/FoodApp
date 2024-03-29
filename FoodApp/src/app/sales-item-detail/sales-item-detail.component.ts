import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesItemService } from '../services/sales-item.service';
import { IngredientSalesItemService } from '../services/ingredient-sales-item.service';
import { IngredientSalesItem } from '../dtos/ingredient-sales-item.dto';
import { IngredientSalesItemDetails } from '../dtos/ingredient-sales-item-details.dto';
import { SalesItem } from '../dtos/sales-item.dto';
import { BasketService } from '../services/basket.service';
import { BasketItem } from '../dtos/basket-item.dto';
import { IngredientService } from '../services/ingredient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-sales-item-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-item-detail.component.html',
  styleUrls: ['./sales-item-detail.component.css']
})
export class SalesItemDetailComponent implements OnInit {
  salesItem: SalesItem | null = null;
  ingredientOptions: IngredientSalesItem[] = [];


  constructor(
    private salesItemService: SalesItemService,
    private ingredientSalesItemService: IngredientSalesItemService,
    private route: ActivatedRoute,
    private basketService: BasketService,
    private ingredientService: IngredientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const salesItemId = this.route.snapshot.params['id'];
    if (salesItemId) {
      this.salesItemService.getSalesItemById(+salesItemId).subscribe(data => {
        console.log(data); // Tilføj denne linje for at se data
        this.salesItem = data;
        this.loadIngredientOptions(+salesItemId);
      });
    }
  }

  loadIngredientOptions(salesItemId: number): void {
    this.ingredientService.getIngredientsWithDetailsBySalesItemId(salesItemId)
      .subscribe(
        ingredientSalesItems => {
          this.ingredientOptions = ingredientSalesItems.map(ingredientSalesItem => ({
            ...ingredientSalesItem,
            // Bruger direkte 'count' værdien fra databasen
            count: ingredientSalesItem.standardCount
          }));
        },
        error => console.error('Error loading ingredients', error)
      );
  }



  addIngredient(ingredientId: number): void {
    let ingredient = this.ingredientOptions.find(ing => ing.ingredientId === ingredientId);
    if (ingredient && ingredient.count < ingredient.max) {
      ingredient.count++;
    }
  }
  getFullImagePath(relativePath: string | undefined): string {
    return relativePath ? `https://localhost:7218${relativePath}` : '';
  }

  removeIngredient(ingredientId: number): void {
    let ingredient = this.ingredientOptions.find(ing => ing.ingredientId === ingredientId);
    if (ingredient) {
      // Tillad at reducere antallet under min, eventuelt ned til 0 eller negativ
      ingredient.count--;
    }
  }
  addToBasket(): void {
    if (this.salesItem) {
      // Opretter BasketItem direkte uden at beregne totalprisen her
      const basketItem = new BasketItem(this.salesItem, 1, this.ingredientOptions);
      // BasketService håndterer priskalkulationen og opdaterer kurven
      this.basketService.addToBasket(basketItem);
    }
  }

}




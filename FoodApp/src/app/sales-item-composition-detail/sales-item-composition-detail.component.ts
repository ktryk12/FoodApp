import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesItemCompositionService } from '../services/sales-item-composition.service';
import { SalesItemCompositionWithDetails } from '../dtos/sales-item-composition-with-details.dto';
import { IngredientService } from '../services/ingredient.service';
import { BasketService } from '../services/basket.service';
import { BasketItem } from '../dtos/basket-item.dto';
import { IngredientSalesItem } from '../dtos/ingredient-sales-item.dto';
import { IngredientSalesItemDetails } from '../dtos/ingredient-sales-item-details.dto';

@Component({
  selector: 'app-sales-item-composition-detail',
  templateUrl: './sales-item-composition-detail.component.html',
  styleUrls: ['./sales-item-composition-detail.component.css']
})
export class SalesItemCompositionDetailComponent implements OnInit {
  compositionWithDetails?: SalesItemCompositionWithDetails;
  availableIngredients: { [childItemId: number]: IngredientSalesItemDetails[] } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesItemCompositionService: SalesItemCompositionService,
    private ingredientService: IngredientService,
    private basketService: BasketService
  ) { }

  ngOnInit(): void {
    const parentItemId = Number(this.route.snapshot.params['parentItemId']);
    if (!isNaN(parentItemId)) {
      this.loadCompositionWithDetails(parentItemId);
    } else {
      console.error('Invalid ID: ', parentItemId);
    }
  }

  loadCompositionWithDetails(parentItemId: number): void {
    this.salesItemCompositionService.getCompositionWithDetails(parentItemId).subscribe(
      (compositionDetails) => {
        if (compositionDetails) {
          this.compositionWithDetails = compositionDetails;
          this.loadAvailableIngredients(compositionDetails);
        } else {
          console.error('Composition details are missing');
        }
      },
      error => console.error('Error fetching composition details', error)
    );
  }

  loadAvailableIngredients(compositionDetails: SalesItemCompositionWithDetails): void {
    compositionDetails.childItems?.forEach(childItem => {
      this.ingredientService.getIngredientsWithDetailsBySalesItemId(childItem.id).subscribe(
        ingredients => {
          this.availableIngredients[childItem.id] = ingredients;
        },
        error => console.error(`Error loading ingredients for childItem ${childItem.id}`, error)
      );
    });
  }
  addIngredientToChildItem(childItemId: number, ingredientId: number): void {
    let ingredientDetail = this.availableIngredients[childItemId]?.find(ing => ing.ingredientId === ingredientId);
    if (ingredientDetail && ingredientDetail.count < ingredientDetail.max) {
      ingredientDetail.count++;
    }
  }

  removeIngredientFromChildItem(childItemId: number, ingredientId: number): void {
    let ingredientDetail = this.availableIngredients[childItemId]?.find(ing => ing.ingredientId === ingredientId);
    if (ingredientDetail && ingredientDetail.count > ingredientDetail.min) {
      ingredientDetail.count--;
    }
  }

  addToBasket(): void {
    if (this.compositionWithDetails && this.compositionWithDetails.parentItem) {
      let customizations: IngredientSalesItem[] = [];
      this.compositionWithDetails.childItems?.forEach(childItem => {
        // Her antages det, at availableIngredients indeholder de korrekte count, min, og max værdier for hver ingrediens
        const selectedIngredients = this.availableIngredients[childItem.id]?.filter(ing => ing.count > 0);
        customizations.push(...selectedIngredients.map(ing => ({
          salesItemId: childItem.id,
          ingredientId: ing.ingredientId,
          count: ing.count, // Bevarer den valgte count værdi
          min: ing.min,     // Bevarer den oprindelige min værdi
          max: ing.max,     // Bevarer den oprindelige max værdi
          ingredient: ing.ingredient
        })));
      });

      const basketItem: BasketItem = {
        item: this.compositionWithDetails,
        quantity: 1,
        customizations: customizations,
        totalPrice: 0 // Beregnes af BasketService
      };

      this.basketService.addToBasket(basketItem);
    }
  }


  collectCustomizations(): IngredientSalesItem[] {
    let customizations: IngredientSalesItem[] = [];
    Object.keys(this.availableIngredients).forEach(childItemId => {
      const childIdNumber = Number(childItemId);
      customizations.push(...this.availableIngredients[childIdNumber]);
    });
    return customizations;
  }

  getFullImagePath(relativePath: string | undefined): string {
    return relativePath ? `https://localhost:7218${relativePath}` : '';
  }

  goBack(): void {
    this.router.navigate(['../']);
  }
}

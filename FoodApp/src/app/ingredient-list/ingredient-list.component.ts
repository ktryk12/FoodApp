import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../services/ingredient.service';
import { Ingredient } from '../dtos/ingredient.dto';
import { SalesItem } from '../dtos/sales-item.dto';
import { IngredientSalesItem } from '../dtos/ingredient-sales-item.dto';
import { SalesItemService } from '../services/sales-item.service';
import { IngredientSalesItemService } from '../services/ingredient-sales-item.service';
import { IngredientSelection } from '../dtos/ingredient-selection.dto';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent implements OnInit {
  ingredients: Ingredient[] = [];
  salesItems: SalesItem[] = [];
  selectedSalesItem: SalesItem | null = null;
  ingredientSelections: IngredientSelection[] = [];
  constructor(
    private ingredientService: IngredientService,
    private salesItemService: SalesItemService,
    private ingredientSalesItemService: IngredientSalesItemService
  ) { }

  

  ngOnInit() {
    this.loadSalesItems();
    this.loadIngredients();
  }

  loadSalesItems() {
    // Antager at du har en service-metode for at hente alle SalesItems
    this.salesItemService.getAllSalesItems().subscribe(data => {
      this.salesItems = data;
    });
  }

  loadIngredients() {
    this.ingredientService.getAllIngredients().subscribe(data => {
      this.ingredients = data;
      this.ingredientSelections = data.map(ingredient => ({
        ingredient: ingredient,
        min: 0, // Sæt en standardværdi eller hent fra et sted
        max: 0, // Sæt en standardværdi eller hent fra et sted
        count: 0 // Sæt en standardværdi eller hent fra et sted
      }));
    }, error => {
      console.error('Der opstod en fejl under indlæsningen af ingredienser', error);
    });
  }


  onSalesItemSelected(selectedItemId: number) {
    this.selectedSalesItem = this.salesItems.find(item => item.id === selectedItemId) || null;
  }

  getFullImagePath(relativePath: string | undefined): string {
    return relativePath ? `https://localhost:7218${relativePath}` : '';
  }

  addIngredientToSalesItem(selection: IngredientSelection) {
    if (this.selectedSalesItem) {
      let ingredientSalesItem = new IngredientSalesItem();
      ingredientSalesItem.salesItemId = this.selectedSalesItem.id;
      ingredientSalesItem.ingredientId = selection.ingredient.id;
      ingredientSalesItem.min = selection.min;
      ingredientSalesItem.max = selection.max;
      ingredientSalesItem.count = selection.count;

  
      this.ingredientSalesItemService.addOrUpdateIngredientToSalesItem(ingredientSalesItem).subscribe(() => {
        console.log('Ingredient added or updated');
        // Opdater eventuelt UI eller tilstand
      });
    }
  }

}


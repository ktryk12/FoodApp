import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from '../services/ingredient.service';
import { Ingredient } from '../dtos/ingredient.dto';

@Component({
  selector: 'app-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrls: ['./ingredient-edit.component.css']
})
export class IngredientEditComponent implements OnInit {
  ingredient: Ingredient = new Ingredient();
  selectedFile: File | null = null;
  isEdit = false; // Skift til 'true', hvis du redigerer en eksisterende ingrediens

  constructor(
    private ingredientService: IngredientService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const ingredientId = this.route.snapshot.params['id'];
    if (ingredientId) {
      this.ingredientService.getIngredientById(ingredientId).subscribe(data => {
        this.ingredient = data;
        this.isEdit = true;
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void { 
    const formData = new FormData();
    formData.append('name', this.ingredient.name);
    formData.append('ingredientPrice', this.ingredient.ingredientPrice.toString());
    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

    if (this.isEdit) {
      this.ingredientService.updateIngredient(this.ingredient.id, formData).subscribe(() => {
        this.router.navigate(['/ingredients']);
      });
    } else {
      this.ingredientService.createIngredient(formData).subscribe(() => {
        this.router.navigate(['/ingredients']);
      });
    }
  }
}

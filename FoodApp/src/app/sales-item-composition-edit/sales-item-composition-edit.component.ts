import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesItemService } from '../services/sales-item.service';
import { SalesItem } from '../dtos/sales-item.dto';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-sales-item-composition-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-item-composition-edit.component.html',
  styleUrls: ['./sales-item-composition-edit.component.css']
})
export class SalesItemCompositionEditComponent implements OnInit {
  composition: SalesItemComposition = new SalesItemComposition();
  salesItems: SalesItem[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private salesItemService: SalesItemService
  ) { }

  ngOnInit(): void {
    this.loadSalesItems();
  }

  loadSalesItems(): void {
    this.isLoading = true;
    this.salesItemService.getAllSalesItems().subscribe(
      (items) => {
        this.salesItems = items;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching items', error);
        this.errorMessage = 'Error fetching items';
        this.isLoading = false;
      }
    );
  }

  getFullImagePath(relativePath: string | undefined): string {
    return relativePath ? `https://localhost:7218${relativePath}` : '';
  }
  backToAdmin() {
    this.router.navigate(['/admin']);
  }

  saveComposition(): void {
   
    console.log('Saving composition:', this.composition);
    // Navigate to the list view after save
    this.router.navigate(['/sales-item-composition-list']);
  }
  getSelectedSalesItem(id: number): SalesItem | undefined {
    return this.salesItems.find(item => item.id === id);
  }

  cancelEdit(): void {
    this.router.navigate(['/sales-item-composition-list']);
  }
}

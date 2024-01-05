import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesItemService } from '../services/sales-item.service';
import { SalesItem } from '../dtos/sales-item.dto';

@Component({
  selector: 'app-sales-item-edit',
  templateUrl: './sales-item-edit.component.html',
  styleUrls: ['./sales-item-edit.component.css']
})
export class SalesItemEditComponent implements OnInit {
  salesItem: SalesItem;
  selectedFile: File | null = null;

  constructor(
    private salesItemService: SalesItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.salesItem = this.createEmptySalesItem();
  }

  ngOnInit(): void {
    const salesItemId = this.route.snapshot.params['id'];
    if (salesItemId) {
      this.salesItemService.getSalesItemById(+salesItemId).subscribe(data => {
        this.salesItem = data;
      }, error => {
        console.error('Error fetching Sales Item', error);
        this.salesItem = this.createEmptySalesItem();
      });
    }
  }

  createEmptySalesItem(): SalesItem {
    return {
      id: 0,
      name: '',
      productNumber: '',
      imageUrl: '',
      basePrice: 0,
      category: '',
      salesItemGroup: 0,
      isActive: false,
      isComposite: false
    };
  }


  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files?.item(0);

    if (file) {
      this.selectedFile = file;
    }
  }
  backToAdmin() {
    this.router.navigate(['/admin']);
  }
  saveSalesItem(): void {
    if (this.salesItem) {
      const formData = new FormData();
      formData.append('name', this.salesItem.name);
      formData.append('productNumber', this.salesItem.productNumber);
      formData.append('basePrice', this.salesItem.basePrice.toString());
      formData.append('category', this.salesItem.category);
      formData.append('isActive', this.salesItem.isActive.toString());
      formData.append('isComposite', this.salesItem.isComposite.toString());

      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile, this.selectedFile.name);
      }

      // Tjek om det er en ny oprettelse eller en opdatering baseret på tilstedeværelsen af ID
      if (this.salesItem.id) {
        this.salesItemService.updateSalesItem(this.salesItem.id, formData).subscribe(() => {
          this.router.navigate(['/sales-items']);
        });
      } else {
        this.salesItemService.createSalesItem(formData).subscribe(() => {
          this.router.navigate(['/sales-items']);
        });
      }
    }

  }
}

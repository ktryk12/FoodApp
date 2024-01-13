import { Component, OnInit } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { Shop } from '../dtos/shop.dto';
import { ShopType } from '../dtos/shop.dto';

@Component({
  selector: 'app-shop-edit',
  templateUrl: './shop-edit.component.html',
  styleUrls: ['./shop-edit.component.css']
})
export class ShopEditComponent implements OnInit {
  shop: Shop = { id: 0, name: '', location: '', type: ShopType.Restaurant, imageUrl: '' };


  selectedFile: File | null = null;

  constructor(private shopService: ShopService) { }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files ? target.files[0] : null;
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.shop.name);
    formData.append('location', this.shop.location);
    formData.append('type', this.shop.type.toString());

    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

     else {
      this.shopService.createShop(formData).subscribe(/* håndter respons */);
    }
  }
 
  updateShop(): void {
    const formData = new FormData();
    formData.append('name', this.shop.name);
    formData.append('location', this.shop.location);
    formData.append('type', this.shop.type.toString());
    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

    this.shopService.updateShop(this.shop.id, formData).subscribe(/* håndter respons */);
  }


  deleteShop(id: number): void {
    if (this.shop.id) {
      this.shopService.deleteShop(this.shop.id).subscribe(/* håndter respons */);
    }
  }
}

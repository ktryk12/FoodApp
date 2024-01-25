import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../services/discount.service';
import { Discount } from '../dtos/discount.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-discount-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discount-list.component.html',
  styleUrls: ['./discount-list.component.css']
})
export class DiscountListComponent implements OnInit {
  discounts: Discount[] = [];

  constructor(private discountService: DiscountService) { }

  ngOnInit() {
    this.discountService.getAllDiscounts().subscribe(data => {
      this.discounts = data;
    });
  }
}

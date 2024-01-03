import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../services/discount.service';
import { Discount } from '../dtos/discount.dto';

@Component({
  selector: 'app-discount-list',
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

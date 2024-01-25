import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountService } from '../services/discount.service';
import { Discount } from '../dtos/discount.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-discount-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discount-edit.component.html',
  styleUrls: ['./discount-edit.component.css']
})
export class DiscountEditComponent implements OnInit {
  discount: Discount = new Discount();
  isEdit = false;

  constructor(
    private discountService: DiscountService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const discountId = this.route.snapshot.params['id'];
    if (discountId) {
      this.discountService.getDiscountById(discountId).subscribe(data => {
        this.discount = data;
        this.isEdit = true;
      });
    }
  }

  saveDiscount(): void {
    if (this.isEdit) {
      this.discountService.updateDiscountById(this.discount).subscribe(() => {
        this.router.navigate(['/discounts']);
      });
    } else {
      this.discountService.createDiscount(this.discount).subscribe(() => {
        this.router.navigate(['/discounts']);
      });
    }
  }
}

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';



@Component({
  selector: 'app-payment-failure',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.css']
})
export class PaymentFailureComponent {

}

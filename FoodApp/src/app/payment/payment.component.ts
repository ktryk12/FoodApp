import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';



@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  amount: number = 0; // Eksempel på beløb der skal betales
  isProcessing: boolean = false; // Status for betalingsproces

  processPayment() {
    this.isProcessing = true;

    // Simulerer en betalingsproces
    setTimeout(() => {
      this.isProcessing = false;
      // Her kan du navigere til en success-side eller vise en meddelelse om, at betalingen blev gennemført
    }, 3000); // 3 sekunders forsinkelse
  }
}

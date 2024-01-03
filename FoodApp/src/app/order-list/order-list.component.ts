import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { OrderData } from '../dtos/order-data.dto';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: OrderData[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data;
    });
  }
}


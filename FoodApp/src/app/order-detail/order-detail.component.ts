import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { OrderlineService } from '../services/orderline.service';
import { OrderData } from '../dtos/order-data.dto'; 
import { Orderline } from '../dtos/orderline.dto';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: OrderData | null = null;
  orderlines: Orderline[] = [];

  constructor(
    private orderService: OrderService,
    private orderlineService: OrderlineService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.params['id'];
    this.orderService.getOrderById(orderId).subscribe(data => {
      this.order = data;
      this.loadOrderlines(orderId);
    });
  }

  loadOrderlines(orderId: number): void {
    this.orderlineService.getOrderlinesByOrderId(orderId).subscribe(data => {
      this.orderlines = data;
    });
  }
}


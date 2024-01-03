import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderData } from '../dtos/order-data.dto'; 
import { CreateOrderResponse } from '../dtos/create-order-response.dto ';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:7218/api/order'; // Erstat med din faktiske API URL

  constructor(private http: HttpClient) { }

  // Opret en ny ordre
  createOrder(shopId: number): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(`${this.apiUrl}/${shopId}`, null);
  }

  // Hent en specifik ordre
  getOrderById(orderId: number): Observable<OrderData> {
    return this.http.get<OrderData>(`${this.apiUrl}/${orderId}`);
  }

  // Opdater en eksisterende ordre
  updateOrder(order: OrderData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${order.id}`, order);
  }

  // Slet en ordre
  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`);
  }

  // Hent alle ordrer
  getAllOrders(): Observable<OrderData[]> {
    return this.http.get<OrderData[]>(this.apiUrl);
  }

  // Opdater total på en ordre
  updateOrderTotal(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateTotal/${orderId}`, null);
  }
}

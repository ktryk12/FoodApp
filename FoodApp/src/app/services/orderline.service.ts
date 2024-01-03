import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orderline } from '../dtos/orderline.dto'; // Antager du har en modeldefination for Orderline og OrderlineTypeDto

@Injectable({
  providedIn: 'root'
})
export class OrderlineService {
  private apiUrl = 'https://localhost:7218/api/orderline'; // Erstat med din faktiske API URL

  constructor(private http: HttpClient) { }

  // Opret en ny orderline
  createOrderline(orderline: Orderline): Observable<Orderline> {
    return this.http.post<Orderline>(this.apiUrl, orderline);
  }

  // Opdater en eksisterende orderline
  updateOrderline(orderline: Orderline): Observable<Orderline> {
    return this.http.put<Orderline>(`${this.apiUrl}/${orderline.id}`, orderline);
  }
  // orderType 
  getReferenceEntityByOrderline(orderline: Orderline): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/referenceEntity`, orderline);
  }

  // Slet en orderline
  deleteOrderline(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Hent en specifik orderline
  getOrderlineById(id: number): Observable<Orderline> {
    return this.http.get<Orderline>(`${this.apiUrl}/${id}`);
  }

  getOrderlinesByOrderId(orderId: number): Observable<Orderline[]> {
    return this.http.get<Orderline[]>(`${this.apiUrl}/order/${orderId}/orderlines`);
  }

  // Hent alle orderlines
  getAllOrderlines(): Observable<Orderline[]> {
    return this.http.get<Orderline[]>(this.apiUrl);
  }
}

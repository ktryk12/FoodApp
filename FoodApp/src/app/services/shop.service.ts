import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shop } from '../dtos/shop.dto';
import { SalesItem } from '../dtos/sales-item.dto'; 

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = 'https://localhost:7218/api/shop';

  constructor(private http: HttpClient) { }

  getAllShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(this.apiUrl);
  }

  getShop(id: number): Observable<Shop> {
    return this.http.get<Shop>(`${this.apiUrl}/${id}`);
  }

  createShop(shopData: FormData): Observable<Shop> {
    return this.http.post<Shop>(this.apiUrl, shopData);
  }


  updateShop(id: number, shopData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, shopData);
  }

  deleteShop(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addSalesItemToShop(shopId: number, salesItemDto: SalesItem): Observable<any> {
    return this.http.post(`${this.apiUrl}/${shopId}/salesItem`, salesItemDto);
  }

  removeSalesItemFromShop(shopId: number, salesItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${shopId}/salesItem/${salesItemId}`);
  }

  getSalesItemIdsByShopId(shopId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${shopId}/salesitems`);
  }
}

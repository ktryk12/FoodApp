import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesItem } from '../dtos/sales-item.dto';

@Injectable({
  providedIn: 'root'
})
export class SalesItemService {
  private apiUrl = 'https://localhost:7218/api/salesItem';

  constructor(private http: HttpClient) { }

  createSalesItem(formData: FormData): Observable<SalesItem> {
    return this.http.post<SalesItem>(this.apiUrl, formData);
  }

  getSalesItemById(id: number): Observable<SalesItem> {
    return this.http.get<SalesItem>(`${this.apiUrl}/${id}`);
  }

  getAllSalesItems(): Observable<SalesItem[]> {
    return this.http.get<SalesItem[]>(this.apiUrl);
  }

  updateSalesItem(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }

  deleteSalesItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSalesItemsByCategory(category: string): Observable<SalesItem[]> {
    return this.http.get<SalesItem[]>(`${this.apiUrl}/ByCategory/${category}`);
  }
  getSalesItemsByIsComposite(isComposite: boolean): Observable<SalesItem[]> {
    return this.http.get<SalesItem[]>(`${this.apiUrl}/ByIsComposite/${isComposite}`);
  }
  
}


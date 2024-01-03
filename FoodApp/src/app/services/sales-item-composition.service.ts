// sales-item-composition.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';
import { SalesItemCompositionWithDetails } from '../dtos/sales-item-composition-with-details.dto';
import { SalesItem } from '../dtos/sales-item.dto';

@Injectable({
  providedIn: 'root'
})
export class SalesItemCompositionService {
  private apiUrl = 'https://localhost:7218/api/salesitemcomposition';

  constructor(private http: HttpClient) { }

  createSalesItemComposition(composition: SalesItemComposition): Observable<SalesItemComposition> {
    return this.http.post<SalesItemComposition>(this.apiUrl, composition);
  }

  getSalesItemCompositionById(parentItemId: number, childItemId: number): Observable<SalesItemComposition> {
    return this.http.get<SalesItemComposition>(`${this.apiUrl}/${parentItemId}/${childItemId}`);
  }

  getAllSalesItemCompositions(): Observable<SalesItemComposition[]> {
    return this.http.get<SalesItemComposition[]>(this.apiUrl);
  }

  updateSalesItemComposition(composition: SalesItemComposition): Observable<void> {
    return this.http.put<void>(this.apiUrl, composition);
  }

  deleteSalesItemComposition(parentItemId: number, childItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${parentItemId}/${childItemId}`);
  }
  getCompositionsByParentItemId(parentItemId: number): Observable<SalesItemComposition[]> {
    return this.http.get<SalesItemComposition[]>(`${this.apiUrl}/parent/${parentItemId}`);
  }
  getCompositionWithDetails(parentItemId: number): Observable<SalesItemCompositionWithDetails> {
    return this.http.get<SalesItemCompositionWithDetails>(`${this.apiUrl}/Details/${parentItemId}`);
  }

}

// sales-item-composition.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { SalesItemComposition } from '../dtos/sales-item-composition.dto';
import { SalesItemCompositionWithDetails } from '../dtos/sales-item-composition-with-details.dto';
import { catchError, tap } from 'rxjs/operators';

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
    console.log(`Attempting to fetch details for SalesItemComposition with parentItemId=${parentItemId}`);

    return this.http.get<SalesItemCompositionWithDetails>(`${this.apiUrl}/Details/${parentItemId}`).pipe(
      tap(response => {
        console.log(`Fetched details for SalesItemComposition with parentItemId=${parentItemId}:`, response);
        if (!response) {
          console.log(`No details found for SalesItemComposition with parentItemId=${parentItemId}`);
        }
      }),
      catchError(error => {
        console.error(`Error fetching details for SalesItemComposition with parentItemId=${parentItemId}:`, error);
        return throwError(() => error);
      })
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

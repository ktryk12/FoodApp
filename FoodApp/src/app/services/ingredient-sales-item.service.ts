import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IngredientSalesItem } from '../dtos/ingredient-sales-item.dto'; // Opdater importstien efter behov

@Injectable({
  providedIn: 'root'
})
export class IngredientSalesItemService {
  private apiUrl = 'https://localhost:7218/api/IngredientSalesItem'; // Opdater med den korrekte API URL

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  addIngredientToSalesItem(ingredientSalesItemDto: IngredientSalesItem): Observable<any> {
    return this.http.post(`${this.apiUrl}`, ingredientSalesItemDto, this.httpOptions).pipe(
      tap(_ => console.log(`Added ingredient to sales item`)),
      catchError(this.handleError<any>('addIngredientToSalesItem'))
    );
  }

  updateIngredientSalesItem(ingredientSalesItemDto: IngredientSalesItem): Observable<any> {
    return this.http.put(`${this.apiUrl}`, ingredientSalesItemDto, this.httpOptions).pipe(
      tap(_ => console.log(`Updated ingredient sales item`)),
      catchError(this.handleError<any>('updateIngredientSalesItem'))
    );
  }

  removeIngredientFromSalesItem(salesItemId: number, ingredientId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${salesItemId}/${ingredientId}`, this.httpOptions).pipe(
      tap(_ => console.log(`Removed ingredient from sales item`)),
      catchError(this.handleError<any>('removeIngredientFromSalesItem'))
    );
  }

  addOrUpdateIngredientToSalesItem(ingredientSalesItemDto: IngredientSalesItem): Observable<any> {
    return this.http.post(`${this.apiUrl}/addOrUpdate`, ingredientSalesItemDto, this.httpOptions).pipe(
      tap(_ => console.log(`Added or updated ingredient in sales item`)),
      catchError(this.handleError<any>('addOrUpdateIngredientToSalesItem'))
    );
  }

  getIngredientSalesItemById(salesItemId: number, ingredientId: number): Observable<IngredientSalesItem> {
    return this.http.get<IngredientSalesItem>(`${this.apiUrl}/${salesItemId}/${ingredientId}`).pipe(
      tap(_ => console.log(`Fetched ingredient sales item by ID`)),
      catchError(this.handleError<IngredientSalesItem>('getIngredientSalesItemById'))
    );
  }
  getIngredientSalesItemsForSalesItem(salesItemId: number): Observable<IngredientSalesItem[]> {
    return this.http.get<IngredientSalesItem[]>(`${this.apiUrl}/forSalesItem/${salesItemId}`).pipe(
      tap(_ => console.log(`Fetched ingredient sales items for salesItemId=${salesItemId}`)),
      catchError(this.handleError<IngredientSalesItem[]>('getIngredientSalesItemsForSalesItem'))
    );
  }
  getAllIngredientSalesItems(): Observable<IngredientSalesItem[]> {
    return this.http.get<IngredientSalesItem[]>(this.apiUrl).pipe(
      tap(_ => console.log(`Fetched all ingredient sales items`)),
      catchError(this.handleError<IngredientSalesItem[]>('getAllIngredientSalesItems', []))
    );
  }
  getAllBySalesItemId(salesItemId: number): Observable<IngredientSalesItem[]> {
    return this.http.get<IngredientSalesItem[]>(`${this.apiUrl}/bySalesItem/${salesItemId}`).pipe(
      tap(_ => console.log(`Fetched ingredient sales items for salesItemId=${salesItemId}`)),
      catchError(this.handleError<IngredientSalesItem[]>('getAllBySalesItemId', []))
    );
  }

  // Error handling method
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

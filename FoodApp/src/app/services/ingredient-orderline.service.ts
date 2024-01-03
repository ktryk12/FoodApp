import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IngredientOrderline } from '../dtos/ingredient-orderline.dto'; // Update the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class IngredientOrderlineService {
  private apiUrl = 'https://localhost:7218/api/ingredientorderline'; // Update with the correct API URL

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  createIngredientOrderline(ingredientOrderline: IngredientOrderline): Observable<IngredientOrderline> {
    return this.http.post<IngredientOrderline>(this.apiUrl, ingredientOrderline, this.httpOptions).pipe(
      tap((newIngredientOrderline: IngredientOrderline) => console.log(`Added ingredient orderline with id=${newIngredientOrderline.orderlineId}`)),
      catchError(this.handleError<IngredientOrderline>('createIngredientOrderline'))
    );
  }

  getIngredientOrderlineById(orderlineId: number, ingredientId: number): Observable<IngredientOrderline> {
    const url = `${this.apiUrl}/${orderlineId}/ingredients/${ingredientId}`;
    return this.http.get<IngredientOrderline>(url).pipe(
      tap(_ => console.log(`Fetched ingredient orderline with orderlineId=${orderlineId} and ingredientId=${ingredientId}`)),
      catchError(this.handleError<IngredientOrderline>('getIngredientOrderlineById'))
    );
  }

  updateIngredientOrderline(ingredientOrderline: IngredientOrderline): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ingredientOrderline.orderlineId}/ingredients/${ingredientOrderline.ingredientId}`, ingredientOrderline, this.httpOptions).pipe(
      tap(_ => console.log(`Updated ingredient orderline with orderlineId=${ingredientOrderline.orderlineId}`)),
      catchError(this.handleError<any>('updateIngredientOrderline'))
    );
  }

  deleteIngredientOrderline(orderlineId: number, ingredientId: number): Observable<any> {
    const url = `${this.apiUrl}/${orderlineId}/ingredients/${ingredientId}`;
    return this.http.delete(url, this.httpOptions).pipe(
      tap(_ => console.log(`Deleted ingredient orderline with orderlineId=${orderlineId} and ingredientId=${ingredientId}`)),
      catchError(this.handleError<any>('deleteIngredientOrderline'))
    );
  }

  // Tilføjer ingredienser til en ordrelinje
  addIngredientsToOrderline(ingredientOrderlinesDto: IngredientOrderline): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addIngredients`, ingredientOrderlinesDto, this.httpOptions).pipe(
      tap(_ => console.log('Added ingredients to orderline')),
      catchError(this.handleError<any>('addIngredientsToOrderline'))
    );
  }

  // Fjerner ingredienser fra en ordrelinje
  removeIngredientsFromOrderline(ingredientOrderlinesDto: IngredientOrderline): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/removeIngredients`, ingredientOrderlinesDto, this.httpOptions).pipe(
      tap(_ => console.log('Removed ingredients from orderline')),
      catchError(this.handleError<any>('removeIngredientsFromOrderline'))
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


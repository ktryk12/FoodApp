import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Ingredient } from '../dtos/ingredient.dto';
import { IngredientSalesItemDetails } from '../dtos/ingredient-sales-item-details.dto';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private apiUrl = 'https://localhost:7218/api/ingredient';

  constructor(private http: HttpClient) { }

  createIngredient(formData: FormData): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.apiUrl, formData).pipe(
      tap((newIngredient: Ingredient) => console.log(`Added ingredient with id=${newIngredient.id}`)),
      catchError(this.handleError<Ingredient>('createIngredient'))
    );
  }

  updateIngredient(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData).pipe(
      tap(_ => console.log(`Updated ingredient with id=${id}`)),
      catchError(this.handleError<any>('updateIngredient'))
    );
  }

  deleteIngredient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(_ => console.log(`Deleted ingredient with id=${id}`)),
      catchError(this.handleError<any>('deleteIngredient'))
    );
  }

  getIngredientById(id: number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.apiUrl}/${id}`).pipe(
      tap(_ => console.log(`Fetched ingredient with id=${id}`)),
      catchError(this.handleError<Ingredient>(`getIngredientById`))
    );
  }

  getAllIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.apiUrl).pipe(
      tap(_ => console.log('Fetched all ingredients')),
      catchError(this.handleError<Ingredient[]>('getAllIngredients', []))
    );
  }

  getIngredientsWithDetailsBySalesItemId(salesItemId: number): Observable<IngredientSalesItemDetails[]> {
     return this.http.get<IngredientSalesItemDetails[]>(`https://localhost:7218/api/Ingredient/DetailsBySalesItemId/${salesItemId}`).pipe(
      tap(_ => console.log(`Fetched ingredient details for salesItemId=${salesItemId}`)),
      catchError(this.handleError<IngredientSalesItemDetails[]>('getIngredientsWithDetailsBySalesItemId', []))
    );
  }

  // ... other methods

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

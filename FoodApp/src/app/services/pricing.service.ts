import { IngredientQuantities } from '../dtos/ingredient-quantities.dto';
import { CalculatePriceRequest } from '../dtos/calculate-price-request.dto';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { CacheEntry } from '../dtos/cache-entry.model';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private apiUrl = 'https://localhost:7218/pricing';
  private cache = new Map<number, CacheEntry<number>>();
  private priceWithIngredientsCache = new Map<string, CacheEntry<number>>();

  private cacheTimeout = 300000; // 5 minutter i millisekunder

  constructor(private http: HttpClient) { }

  calculatePrice(salesItemId: number): Observable<number> {
    const cachedEntry = this.cache.get(salesItemId);

    if (cachedEntry && (new Date().getTime() - cachedEntry.lastUpdated.getTime()) < this.cacheTimeout) {
      return of(cachedEntry.data); // Returnerer cachede data, hvis de er tilgængelige og ikke forældede
    }

    // Henter data fra API og opdaterer cachen
    return this.http.get<number>(`${this.apiUrl}/calculate-price/${salesItemId}`).pipe(
      tap(price => {
        this.cache.set(salesItemId, new CacheEntry(price, new Date()));
      })
    );
  }
  public calculatePriceWithIngredients(salesItemId: number, ingredientQuantities: { [ingredientId: number]: number }): Observable<number> {
    const cacheKey = this.generateCacheKey(salesItemId, ingredientQuantities);
    const cachedEntry = this.priceWithIngredientsCache.get(cacheKey);

    if (cachedEntry && (new Date().getTime() - cachedEntry.lastUpdated.getTime()) < this.cacheTimeout) {
      return of(cachedEntry.data);
    }

    // Append salesItemId as a query parameter to the URL
    const url = `${this.apiUrl}/calculate-custom-price?salesItemId=${salesItemId}`;

    // Send the ingredientQuantities object directly as the POST body
    return this.http.post<number>(url, ingredientQuantities, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(price => {
        this.priceWithIngredientsCache.set(cacheKey, new CacheEntry(price, new Date()));
      }),
      catchError(error => {
        console.error('Error when calculating price with ingredients', error);
        return throwError(() => new Error(error));
      })
    );
  }


  private generateCacheKey(salesItemId: number, ingredientQuantities: { [ingredientId: number]: number }): string {
    const sortedIngredientIds = Object.keys(ingredientQuantities).sort();
    const quantitiesString = sortedIngredientIds.map(id => `${id}:${ingredientQuantities[Number(id)]}`).join(",");
    return `${salesItemId}-${quantitiesString}`;
  }
}

  

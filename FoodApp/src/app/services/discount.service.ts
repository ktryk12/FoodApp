import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Discount } from '../dtos/discount.dto'; // Update the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = 'https://localhost:7218/api/discount'; // Update with the correct API URL

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getDiscountById(id: number): Observable<Discount> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Discount>(url).pipe(
      tap(_ => console.log(`fetched discount id=${id}`)),
      catchError(this.handleError<Discount>(`getDiscountById id=${id}`))
    );
  }

  getAllDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(this.apiUrl).pipe(
      tap(_ => console.log('fetched all discounts')),
      catchError(this.handleError<Discount[]>('getAllDiscounts', []))
    );
  }

  createDiscount(discount: Discount): Observable<Discount> {
    return this.http.post<Discount>(this.apiUrl, discount, this.httpOptions).pipe(
      tap((newDiscount: Discount) => console.log(`added discount w/ id=${newDiscount.id}`)),
      catchError(this.handleError<Discount>('createDiscount'))
    );
  }

  updateDiscountById(discount: Discount): Observable<any> {
    const url = `${this.apiUrl}/${discount.id}`;
    return this.http.put(url, discount, this.httpOptions).pipe(
      tap(_ => console.log(`updated discount id=${discount.id}`)),
      catchError(this.handleError<any>('updateDiscountById'))
    );
  }

  deleteDiscountById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted discount id=${id}`)),
      catchError(this.handleError<any>('deleteDiscountById'))
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

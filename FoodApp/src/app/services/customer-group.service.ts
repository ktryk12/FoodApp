import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomerGroup } from '../dtos/customer-group.dto';

@Injectable({
  providedIn: 'root'
})
export class CustomerGroupService {
  private apiUrl = 'https://localhost:7218/api/customergroup'; // Update with the correct API URL

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getCustomerGroupById(id: number): Observable<CustomerGroup> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<CustomerGroup>(url).pipe(
      tap(_ => console.log(`fetched customer group id=${id}`)),
      catchError(this.handleError<CustomerGroup>(`getCustomerGroupById id=${id}`))
    );
  }

  getAllCustomerGroups(): Observable<CustomerGroup[]> {
    return this.http.get<CustomerGroup[]>(this.apiUrl).pipe(
      tap(_ => console.log('fetched all customer groups')),
      catchError(this.handleError<CustomerGroup[]>('getAllCustomerGroups', []))
    );
  }

  createCustomerGroup(customerGroupDto: CustomerGroup): Observable<CustomerGroup> {
    return this.http.post<CustomerGroup>(this.apiUrl, customerGroupDto, this.httpOptions).pipe(
      tap((newCustomerGroup: CustomerGroup) => console.log(`added customer group w/ id=${newCustomerGroup.id}`)),
      catchError(this.handleError<CustomerGroup>('createCustomerGroup'))
    );
  }

  updateCustomerGroupById(customerGroup: CustomerGroup): Observable<any> {
    const url = `${this.apiUrl}/${customerGroup.id}`;
    return this.http.put(url, customerGroup, this.httpOptions).pipe(
      tap(_ => console.log(`updated customer group id=${customerGroup.id}`)),
      catchError(this.handleError<any>('updateCustomerGroupById'))
    );
  }

  deleteCustomerGroupById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted customer group id=${id}`)),
      catchError(this.handleError<any>('deleteCustomerGroupById'))
    );
  }

  // Handle the errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

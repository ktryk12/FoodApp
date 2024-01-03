import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesItemGroup } from '../dtos/sales-item-group.dto'; // Antager at du har en DTO-definition for ProductGroup

@Injectable({
  providedIn: 'root'
})
export class SalesItemGroupService {
  private apiUrl = 'https://localhost:7218/api/salesItemgroup'; // Erstat med din faktiske API URL

  constructor(private http: HttpClient) { }

  // Opret en ny produktgruppe
  createSalesItemtGroup(salesItemGroup: SalesItemGroup): Observable<SalesItemGroup> {
    return this.http.post<SalesItemGroup>(this.apiUrl, salesItemGroup);
  }

  // Hent en specifik produktgruppe
  getSalesItemGroupById(id: number): Observable<SalesItemGroup> {
    return this.http.get<SalesItemGroup>(`${this.apiUrl}/${id}`);
  }

  // Hent alle produktgrupper
  getAllSalesItemGroups(): Observable<SalesItemGroup[]> {
    return this.http.get<SalesItemGroup[]>(this.apiUrl);
  }

  // Opdater en eksisterende produktgruppe
  updateSalesItemtGroup(salesItemGroup: SalesItemGroup): Observable<any> {
    return this.http.put(`${this.apiUrl}/${salesItemGroup.id}`, salesItemGroup);
  }

  // Slet en produktgruppe
  deleteSalesItemGroup(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

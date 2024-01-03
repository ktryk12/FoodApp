import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminUser } from '../dtos/admin-user.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {
  // Tillader både AdminUser og null som værdier for BehaviorSubject
  private currentAdminSubject: BehaviorSubject<AdminUser | null>;
  public currentAdmin: Observable<AdminUser | null>;

  constructor(private http: HttpClient) {
    this.currentAdminSubject = new BehaviorSubject<AdminUser | null>(JSON.parse(localStorage.getItem('currentAdmin')!));
    this.currentAdmin = this.currentAdminSubject.asObservable();
  }

  public get currentAdminValue(): AdminUser | null {
    return this.currentAdminSubject.value;
  }

  adminLogin(username: string, password: string) {
    return this.http.post<any>(`/api/admin/login`, { username, password })
      .pipe(map(admin => {
        if (admin && admin.token) {
          localStorage.setItem('currentAdmin', JSON.stringify(admin));
          this.currentAdminSubject.next(admin);
        }
        return admin;
      }));
  }

  adminLogout() {
    localStorage.removeItem('currentAdmin');
    this.currentAdminSubject.next(null);
  }
}


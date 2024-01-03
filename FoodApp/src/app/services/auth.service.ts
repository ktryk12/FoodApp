import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // Henter standard JWT-token fra serveren og opdaterer den aktuelle bruger
  fetchStandardToken() {
    return this.http.get<any>(`https://localhost:7145/api/token/standard-token`) // Ændret URL
      .pipe(map(response => {
        if (response && response.token) {
          console.log('Token hentet:', response.token); // Log tokenen, når den hentes
          localStorage.setItem('currentUser', JSON.stringify({ token: response.token }));
          this.currentUserSubject.next({ token: response.token });
        } else {
          console.log('Ingen token modtaget'); // Log, hvis ingen token modtages
        }
        return response;
      }));
  }

  

  // Opdaterer den aktuelle bruger med en ny token
  setCurrentUser(token: string) {
    localStorage.setItem('currentUser', JSON.stringify({ token }));
    this.currentUserSubject.next({ token });
  }

  // Fjerner den aktuelle brugers token
  clearCurrentUser() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}



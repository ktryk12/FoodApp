// admin-login.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit() {
    this.http.post<HttpResponse<Object>>(`/login`, {
      username: this.username,
      password: this.password
    }, { observe: 'response' }) // Tilføj denne linje for at modtage hele HTTP-responsen
      .subscribe({
        next: (response) => {
          if (response.status === 200) {
            // Brugeren er logget ind
            // Du kan også tjekke response.body for yderligere data, fx JWT-token
          } else {
            // Brugeren er ikke logget ind
          }
        },
        error: (error) => {
          console.error('Login fejl', error);
        }
      });
  }
}

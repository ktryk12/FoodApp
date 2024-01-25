import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importér RouterModule
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterModule // Tilføj RouterModule her
  ]
})
export class AppComponent {
  title = 'app-web';
}

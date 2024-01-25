import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';


@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.css']
})
export class LoadingIndicatorComponent {

}

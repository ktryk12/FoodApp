import { Component, OnInit } from '@angular/core';
import { CustomerGroupService } from '../services/customer-group.service';
import { CustomerGroup } from '../dtos/customer-group.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-custom-group-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-group-list.component.html',
  styleUrls: ['./custom-group-list.component.css']
})
export class CustomGroupListComponent implements OnInit {
  customerGroups: CustomerGroup[] = [];

  constructor(private customerGroupService: CustomerGroupService) { }

  ngOnInit() {
    this.customerGroupService.getAllCustomerGroups().subscribe(groups => {
      this.customerGroups = groups;
    });
  }
  
}


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerGroupService } from '../services/customer-group.service';
import { CustomerGroup } from '../dtos/customer-group.dto';

@Component({
  selector: 'app-custom-group-edit',
  templateUrl: './custom-group-edit.component.html',
  styleUrls: ['./custom-group-edit.component.css']
})
export class CustomGroupEditComponent implements OnInit {
  customerGroup: CustomerGroup = new CustomerGroup();
  isEdit = false;

  constructor(
    private customerGroupService: CustomerGroupService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const groupId = this.route.snapshot.params['id'];
    if (groupId) {
      this.customerGroupService.getCustomerGroupById(groupId).subscribe(data => {
        this.customerGroup = data;
        this.isEdit = true;
      });
    }
  }

  saveCustomerGroup(): void {
    // Gem kundegruppen
  }
}



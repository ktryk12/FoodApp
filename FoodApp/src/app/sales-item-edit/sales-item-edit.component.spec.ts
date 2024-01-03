import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesItemEditComponent } from './sales-item-edit.component';

describe('SalesItemEditComponent', () => {
  let component: SalesItemEditComponent;
  let fixture: ComponentFixture<SalesItemEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesItemEditComponent]
    });
    fixture = TestBed.createComponent(SalesItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

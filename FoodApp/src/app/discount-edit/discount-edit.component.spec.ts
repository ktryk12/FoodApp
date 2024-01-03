import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountEditComponent } from './discount-edit.component';

describe('DiscountEditComponent', () => {
  let component: DiscountEditComponent;
  let fixture: ComponentFixture<DiscountEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountEditComponent]
    });
    fixture = TestBed.createComponent(DiscountEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

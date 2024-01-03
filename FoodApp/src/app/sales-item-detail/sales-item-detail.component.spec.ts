import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesItemDetailComponent } from './sales-item-detail.component';

describe('SalesItemDetailComponent', () => {
  let component: SalesItemDetailComponent;
  let fixture: ComponentFixture<SalesItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesItemDetailComponent]
    });
    fixture = TestBed.createComponent(SalesItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

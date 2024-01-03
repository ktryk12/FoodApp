import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesItemListComponent } from './sales-item-list.component';

describe('SalesItemListComponent', () => {
  let component: SalesItemListComponent;
  let fixture: ComponentFixture<SalesItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesItemListComponent]
    });
    fixture = TestBed.createComponent(SalesItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import {SalesItemCompositionDetailComponent } from './sales-item-composition-detail.component';

describe('SalesItemCompositionDetailComponent', () => {
  let component: SalesItemCompositionDetailComponent;
  let fixture: ComponentFixture<SalesItemCompositionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesItemCompositionDetailComponent]
    });
    fixture = TestBed.createComponent(SalesItemCompositionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesItemCompositionListComponent } from './sales-item-composition-list.component';

describe('SalesItemCompositionListComponent', () => {
  let component: SalesItemCompositionListComponent;
  let fixture: ComponentFixture<SalesItemCompositionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesItemCompositionListComponent]
    });
    fixture = TestBed.createComponent(SalesItemCompositionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

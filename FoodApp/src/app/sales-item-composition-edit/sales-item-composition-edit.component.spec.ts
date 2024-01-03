import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesItemCompositionEditComponent } from './sales-item-composition-edit.component';

describe('SalesItemCompositionEditComponent', () => {
  let component: SalesItemCompositionEditComponent;
  let fixture: ComponentFixture<SalesItemCompositionEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesItemCompositionEditComponent]
    });
    fixture = TestBed.createComponent(SalesItemCompositionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

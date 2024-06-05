import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockRequestDialogComponent } from './stock-request-dialog.component';

describe('StockRequestDialogComponent', () => {
  let component: StockRequestDialogComponent;
  let fixture: ComponentFixture<StockRequestDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockRequestDialogComponent]
    });
    fixture = TestBed.createComponent(StockRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

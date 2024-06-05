import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderRequestPopupComponent } from './view-order-request-popup.component';

describe('ViewOrderRequestPopupComponent', () => {
  let component: ViewOrderRequestPopupComponent;
  let fixture: ComponentFixture<ViewOrderRequestPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewOrderRequestPopupComponent]
    });
    fixture = TestBed.createComponent(ViewOrderRequestPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

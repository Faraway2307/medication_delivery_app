import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePaymentPopupComponent } from './make-payment-popup.component';

describe('MakePaymentPopupComponent', () => {
  let component: MakePaymentPopupComponent;
  let fixture: ComponentFixture<MakePaymentPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MakePaymentPopupComponent]
    });
    fixture = TestBed.createComponent(MakePaymentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

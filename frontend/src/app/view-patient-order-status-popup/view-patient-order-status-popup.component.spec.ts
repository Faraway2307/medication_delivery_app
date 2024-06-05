import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatientOrderStatusPopupComponent } from './view-patient-order-status-popup.component';

describe('ViewPatientOrderStatusPopupComponent', () => {
  let component: ViewPatientOrderStatusPopupComponent;
  let fixture: ComponentFixture<ViewPatientOrderStatusPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPatientOrderStatusPopupComponent]
    });
    fixture = TestBed.createComponent(ViewPatientOrderStatusPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

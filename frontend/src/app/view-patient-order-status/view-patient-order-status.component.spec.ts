import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatientOrderStatusComponent } from './view-patient-order-status.component';

describe('ViewPatientOrderStatusComponent', () => {
  let component: ViewPatientOrderStatusComponent;
  let fixture: ComponentFixture<ViewPatientOrderStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPatientOrderStatusComponent]
    });
    fixture = TestBed.createComponent(ViewPatientOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePatientMedicinePopupComponent } from './create-patient-medicine-popup.component';

describe('CreatePatientMedicinePopupComponent', () => {
  let component: CreatePatientMedicinePopupComponent;
  let fixture: ComponentFixture<CreatePatientMedicinePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePatientMedicinePopupComponent]
    });
    fixture = TestBed.createComponent(CreatePatientMedicinePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

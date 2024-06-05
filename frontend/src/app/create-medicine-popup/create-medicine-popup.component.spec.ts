import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMedicinePopupComponent } from './create-medicine-popup.component';

describe('CreateMedicinePopupComponent', () => {
  let component: CreateMedicinePopupComponent;
  let fixture: ComponentFixture<CreateMedicinePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMedicinePopupComponent]
    });
    fixture = TestBed.createComponent(CreateMedicinePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

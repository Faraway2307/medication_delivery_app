import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineListingPageComponent } from './medicine-listing-page.component';

describe('MedicineListingPageComponent', () => {
  let component: MedicineListingPageComponent;
  let fixture: ComponentFixture<MedicineListingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicineListingPageComponent]
    });
    fixture = TestBed.createComponent(MedicineListingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

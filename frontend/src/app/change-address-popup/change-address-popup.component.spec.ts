import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAddressPopupComponent } from './change-address-popup.component';

describe('ChangeAddressPopupComponent', () => {
  let component: ChangeAddressPopupComponent;
  let fixture: ComponentFixture<ChangeAddressPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeAddressPopupComponent]
    });
    fixture = TestBed.createComponent(ChangeAddressPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

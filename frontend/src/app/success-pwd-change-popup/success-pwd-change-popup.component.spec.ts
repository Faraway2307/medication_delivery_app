import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPwdChangePopupComponent } from './success-pwd-change-popup.component';

describe('SuccessPwdChangePopupComponent', () => {
  let component: SuccessPwdChangePopupComponent;
  let fixture: ComponentFixture<SuccessPwdChangePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessPwdChangePopupComponent]
    });
    fixture = TestBed.createComponent(SuccessPwdChangePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

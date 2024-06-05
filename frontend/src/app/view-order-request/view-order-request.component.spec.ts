import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderRequestComponent } from './view-order-request.component';

describe('ViewOrderRequestComponent', () => {
  let component: ViewOrderRequestComponent;
  let fixture: ComponentFixture<ViewOrderRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewOrderRequestComponent]
    });
    fixture = TestBed.createComponent(ViewOrderRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

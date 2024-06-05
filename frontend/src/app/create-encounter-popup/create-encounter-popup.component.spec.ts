import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEncounterPopupComponent } from './create-encounter-popup.component';

describe('CreateEncounterPopupComponent', () => {
  let component: CreateEncounterPopupComponent;
  let fixture: ComponentFixture<CreateEncounterPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEncounterPopupComponent]
    });
    fixture = TestBed.createComponent(CreateEncounterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

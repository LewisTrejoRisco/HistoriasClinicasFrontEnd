import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgregarVacunaModalComponent } from './agregar-vacuna-modal.component';

describe('AgregarVacunaModalComponent', () => {
  let component: AgregarVacunaModalComponent;
  let fixture: ComponentFixture<AgregarVacunaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarVacunaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarVacunaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

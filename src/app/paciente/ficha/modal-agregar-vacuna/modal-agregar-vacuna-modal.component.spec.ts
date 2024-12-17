import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalAgregarVacunaModalComponent } from './modal-agregar-vacuna-modal.component';

describe('ModalAgregarVacunaModalComponent', () => {
  let component: ModalAgregarVacunaModalComponent;
  let fixture: ComponentFixture<ModalAgregarVacunaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAgregarVacunaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAgregarVacunaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

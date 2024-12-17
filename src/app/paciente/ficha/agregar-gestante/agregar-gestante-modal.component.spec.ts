import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgregarGestanteModalComponent } from './agregar-gestante-modal.component';

describe('AgregarGestanteModalComponent', () => {
  let component: AgregarGestanteModalComponent;
  let fixture: ComponentFixture<AgregarGestanteModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarGestanteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarGestanteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

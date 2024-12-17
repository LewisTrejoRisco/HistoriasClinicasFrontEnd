import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgregarAnteOcupModalComponent } from './agregar-anteocup-modal.component';

describe('SolicitarPermisoModalComponent', () => {
  let component: AgregarAnteOcupModalComponent;
  let fixture: ComponentFixture<AgregarAnteOcupModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarAnteOcupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAnteOcupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

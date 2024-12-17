import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgregarAntepatoModalComponent } from './agregar-antepato-modal.component';

describe('SolicitarPermisoModalComponent', () => {
  let component: AgregarAntepatoModalComponent;
  let fixture: ComponentFixture<AgregarAntepatoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarAntepatoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAntepatoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

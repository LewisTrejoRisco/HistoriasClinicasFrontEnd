import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgregarAnteOcupAptitudModalComponent } from './agregar-anteocup-aptitud-modal.component';

describe('AgregarAnteOcupAptitudModalComponent', () => {
  let component: AgregarAnteOcupAptitudModalComponent;
  let fixture: ComponentFixture<AgregarAnteOcupAptitudModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarAnteOcupAptitudModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAnteOcupAptitudModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

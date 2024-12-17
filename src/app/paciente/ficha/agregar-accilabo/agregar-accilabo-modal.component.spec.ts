import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgregarAcciLaboModalComponent } from './agregar-accilabo-modal.component';

describe('AgregarAcciLaboModalComponent', () => {
  let component: AgregarAcciLaboModalComponent;
  let fixture: ComponentFixture<AgregarAcciLaboModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarAcciLaboModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAcciLaboModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

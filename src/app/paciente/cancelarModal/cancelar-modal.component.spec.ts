import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CancelarModalComponent } from './cancelar-modal.component';

describe('SolicitarModalComponent', () => {
  let component: CancelarModalComponent;
  let fixture: ComponentFixture<CancelarModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

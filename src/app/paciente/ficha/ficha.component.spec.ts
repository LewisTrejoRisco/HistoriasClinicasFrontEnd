import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaComponent } from './ficha.component';

describe('SolicitarLicenciaComponent', () => {
  let component: FichaComponent;
  let fixture: ComponentFixture<FichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

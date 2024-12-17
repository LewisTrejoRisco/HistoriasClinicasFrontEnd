import { Component, Output, EventEmitter, Input, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : '';
  }
}

@Component({
  selector: 'app-agregar-accilabo-modal',
  templateUrl: './agregar-accilabo-modal.component.html',
  styleUrls: ['./agregar-accilabo-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
  ]
})
export class AgregarAcciLaboModalComponent implements OnInit{

  type = 'Marketing';
  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  listReferencia: any = [
    {treferencia: 0, tdescreferencia: 'No'},
    {treferencia: 1, tdescreferencia: 'Si'}
  ]
  // VALIDACIONES REQUERIDAS
  modalFormSubmitted = false;

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder,
   private changeDetector:ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.buildItemForm(this.data);
  }
  

  get lf() {
    return this.myForm.controls;
  }

  private buildItemForm(item) {
    //console.log(item)
    // if(item.horas != null) {
    //   item.horas = this.horas.find(a => a.name == item.horas);
    // }
    // if(item.minutos != null) {
    //   item.minutos = this.minutos.find(a => a.name == item.minutos);
    // }
    this.myForm = this.formBuilder.group({
      tfechacci: [item.tfechacci || null, Validators.required],
      tdiagnostico: [item.tdiagnostico || null, Validators.required],
      tclasificacion: [item.tclasificacion || null, Validators.required],
      treferencia: [item.treferencia || null],
      tdescansomedico: [item.tdescansomedico || null],
      trestriccionlaboral: [item.trestriccionlaboral || null],
      tindicacionespecial: [item.tindicacionespecial || null],
      tobservaciones: [item.tobservaciones || null],
    });
    // this.profileImage = this.myForm.value.documento;
  }

  submitForm() {
    this.modalFormSubmitted = true;
    if (this.myForm.invalid) {
      return;
    }
    // this.myForm.value.documento = this.profileImage;
    this.activeModal.close(this.myForm.value);
  }

}

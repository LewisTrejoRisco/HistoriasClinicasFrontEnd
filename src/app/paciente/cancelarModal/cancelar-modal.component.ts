import { Component, Output, EventEmitter, Input, OnInit, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-cancelar-modal',
  templateUrl: './cancelar-modal.component.html',
  styleUrls: ['./cancelar-modal.component.scss']
})
export class CancelarModalComponent implements OnInit{

  @Input() titulo: string;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder
  ) {

  }

  ngOnInit() {
    this.buildItemForm(this.data);
  }

  private buildItemForm(item) {
    //console.log(item)
    this.myForm = this.formBuilder.group({
    });
  }

  submitForm() {
    this.activeModal.close(this.myForm.value);
  }

}

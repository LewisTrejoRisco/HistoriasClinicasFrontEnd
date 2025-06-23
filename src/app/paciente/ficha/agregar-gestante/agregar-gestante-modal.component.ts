import { Component, Output, EventEmitter, Input, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { LISTAR_GESTANTE } from 'app/shared/utilitarios/Constantes';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

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
  selector: 'app-agregar-gestante-modal',
  templateUrl: './agregar-gestante-modal.component.html',
  styleUrls: ['./agregar-gestante-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, 
      useClass: CustomDateParserFormatter
    },
    SolicitarService
  ]
})
export class AgregarGestanteModalComponent implements OnInit{

  type = 'Marketing';
  @Input() id: number;
  @Input() tipo: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  d3: any;
  d4: any;
  d5: any;
  d6: any;
  // VALIDACIONES REQUERIDAS
  modalFormSubmitted = false;
  // GESTANTE
  listgestante: any = [];

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder,
   private changeDetector:ChangeDetectorRef, 
   private solicitarService: SolicitarService
  ) {

  }

  ngOnInit() {
    this.buildItemForm(this.data);
    this.listGestante();
  }
  

  get lf() {
    return this.myForm.controls;
  }

  private buildItemForm(item) {
    this.myForm = this.formBuilder.group({
      tnumecontrol: [item.tnumecontrol || null],
      tfechcapt: [item.tfechcapt || null],
      tfur: [item.tfur || null],
      tfpp: [item.tfpp || null],
      tformobst: [item.tformobst || null],
      tsemagest: [item.tsemagest || null],
      tpeso: [item.tpeso || null],
      tpresarte: [item.tpresarte || null],
      tpulso: [item.tpulso || null],
      tconthosp: [item.tconthosp || null],
      ttelecont: [item.ttelecont || null],
      ttelefami: [item.ttelefami || null],
      totros: [item.totros || null],
      triescovi: [item.triescovi || null],
      tcontcovi: [item.tcontcovi || null],
      triesocup: [item.triesocup || null],
      tturntrab: [item.tturntrab || null],
      tanamnesis: [item.tanamnesis || null],
      tindica: [item.tindica || null],
      ttemperatura: [item.ttemperatura || null],
      tau: [item.tau || null],
      tlcf: [item.tlcf || null],
      tmovifeta: [item.tmovifeta || null],
      tsitu: [item.tsitu || null],
      tpres: [item.tpres || null],
      tposi: [item.tposi || null],
      tedemmmi: [item.tedemmmi || null],
      tobse: [item.tobse || null],
      tsato: [item.tsato || null],
      tproxcita: [item.tproxcita || null],
      usuarioSolicitar: [item.usuarioSolicitar || null],
      tfechinicdescprenata: [item.tfechinicdescprenata || null]
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
  

  listGestante(){
    console.log(this.myForm.value.usuarioSolicitar.tcodipers)
    let tcodipers = this.myForm.value.usuarioSolicitar.tcodipers;
    let path = LISTAR_GESTANTE;
    let param = "?tcodipers=" + tcodipers;
    forkJoin({
      listgestante: this.solicitarService.listar(path, param)
    }).subscribe({
      next: ({ listgestante }) => {
        this.listgestante = listgestante;
      },
      error: error => {
        Swal.fire(
          'Error',
          'Error al cargar listagestante: ' + error.message,
          'error'
        );
      }
    });
  }

}

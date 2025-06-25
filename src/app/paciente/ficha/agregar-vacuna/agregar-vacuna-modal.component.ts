import { Component, Output, EventEmitter, Input, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import Swal from 'sweetalert2';
import { ModalAgregarVacunaModalComponent } from '../modal-agregar-vacuna/modal-agregar-vacuna-modal.component';

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
  selector: 'app-agregar-vacuna-modal',
  templateUrl: './agregar-vacuna-modal.component.html',
  styleUrls: ['./agregar-vacuna-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
    SolicitarService
  ]
})
export class AgregarVacunaModalComponent implements OnInit{

  type = 'Marketing';
  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  d3: any;
  listvacuna: any = [];
  likevacuna: any = [];
  sesion: any;
  // VALIDACIONES REQUERIDAS
  modalFormSubmitted = false;

  constructor(
    private modalService: NgbModal,
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder,
   private changeDetector:ChangeDetectorRef,
   private solicitarService: SolicitarService,
   private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.buildItemForm(this.data);
  }

  get lf() {
    // //console.log(this.myForm.controls)
    return this.myForm.controls;
  }

  private buildItemForm(item) {
    this.myForm = this.formBuilder.group({
      tdescvacu: [item.tdescvacu || null, Validators.required],
      tfechapli: [item.tfechapli || null, Validators.required]
    });
  }

  addTagFn(tdescvacu: string) {
    const modalRef = this.modalService.open(ModalAgregarVacunaModalComponent);
    modalRef.componentInstance.id = 1;
    modalRef.componentInstance.data = { 
      tdescvacu: tdescvacu, 
      ttotanumedosi: null
                                      }
    modalRef.result.then((result) => {
      // console.log(result)
      // console.log(objeInse)
      
    // Crea un objeto temporal para mostrar en el select inmediatamente
    const tempItem = { idvacuna: null, tdescvacu: result.tdescvacu};
    this.listvacuna.push(tempItem);
    // this.selectedItem = tempItem; // Selecciona el nuevo item temporalmente

    // Crea el objeto para la llamada al servicio
    // let insert = {
    //   tdescantepato: result.tdescvacu,
    //   tcodipersregi: this.sesion.tcodipers // Ajusta esto según tus necesidades
    // };
    let insert = null;
    insert = {
      idvacuna: null,
      tdescvacu: result.tdescvacu,
      ttotanumedosi: result.ttotanumedosi,
      tcodipersregi: this.sesion.tcodipers,
      tcodipersactu: this.sesion.tcodipers
    }
    
    // Llamada al servicio para agregar el nuevo valor
    this.solicitarService.agreVacunas(insert).subscribe(
      resp => {
        var objeResp: any = resp;
        // console.log(objeResp);

        // Actualiza el objeto temporal con el ID recibido del servicio
        tempItem.idvacuna = objeResp.primaryKey;
        
        Swal.fire({
          title: 'Éxito',
          text: 'Operación exitosa',
          icon: 'success',
          timer: 1500, 
          showConfirmButton: false,
        });
      },
      error => {
        console.log("error:", error.message);
        
        Swal.fire(
          'Error',
          'Alerta: ' + error.message,
          'error'
        );

        // Remueve el objeto temporal en caso de error
        this.listvacuna = this.listvacuna.filter(item => item !== tempItem);
      }
    );
    // tempItem.idvacuna = 1
    // console.log(this.listvacuna)
    // this.myForm.value.tdescvacu = {
    //   idvacuna: tempItem.idvacuna,
    //   tdescvacu: tempItem.tdescvacu
    // }
    let tdescvacu = {
      idvacuna : tempItem.idvacuna,
      tdescvacu : tempItem.tdescvacu
    };
    this.myForm.value.tdescvacu = tdescvacu;
    // this.myForm = this.formBuilder.group({
    //   tdescvacu: [tdescvacu || null, Validators.required],
    //   tfechprog: [null, Validators.required],
    //   tfechinic: [null, Validators.required]
    // });
    // Retorna el objeto temporal para que ng-select lo maneje inmediatamente
    }).catch((error) => {
      console.log(error);
    });
  }

  onKeyVacuna(event:any) {
    if(event.target.value.length >= 3) {
      // console.log(event.target.value);
      this.likeVacuna(event.target.value);
    }
  }

  likeVacuna(tdescvacu: string) {
    this.solicitarService.listVacuna(tdescvacu).subscribe(
      resp => {
        this.likevacuna = resp;
        if (this.likevacuna.length > 0) {
          this.listvacuna = this.likevacuna.map(item => ({
            idvacuna: item.idvacuna,
            tdescvacu: item.tdescvacu
          }));
        } 
      },
      error => {
          console.log("error:", error.message)
          Swal.fire(
            'Error',
            'Alerta:'+ error.message,
            'error'
          );
      }
    )
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

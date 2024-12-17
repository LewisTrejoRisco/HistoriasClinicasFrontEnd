import { Component, Output, EventEmitter, Input, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
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
  selector: 'app-agregar-anteocup-aptitud-modal',
  templateUrl: './agregar-anteocup-aptitud-modal.component.html',
  styleUrls: ['./agregar-anteocup-aptitud-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
    SolicitarService
  ]
})
export class AgregarAnteOcupAptitudModalComponent implements OnInit{

  type = 'Marketing';
  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  sesion: any;
  listespecialidad: any  = [];
  likeEspecialidad: any = [];
  listrestriccion: any = [];
  likeRestriccion: any = [];
  listaptitud: any = [];
  idEspecialidad: number = 0;
  aptitud: number = 0;
  // VALIDACIONES REQUERIDAS
  modalFormSubmitted = false;
  control = [
    { tstatus: 0, tstatusdesc: 'No' },
    { tstatus: 1, tstatusdesc: 'Si' }
  ];

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder,
   private changeDetector:ChangeDetectorRef,
   private solicitarService: SolicitarService,
   private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.sesion = JSON.parse(this.authService.userSesion);
    // this.listAptitudAO();
    this.buildItemForm(this.data);
  }

  get lf() {
    return this.myForm.controls;
  }

  private buildItemForm(item) {
    console.log(item)
    this.myForm = this.formBuilder.group({
      tnombespe: [item.tnombespe || null],
      tnombrest: [item.tnombrest || null],
      idaptitudemo: [item.idaptitudemo || null, Validators.required],
      tfechalimite: [item.tfechalimite || null],
      tstatus: [item.tstatus || null]
    });

    // Establece la validación basada en 'aptitud'
    this.updateFormValidators();
    this.aptitud = item.idaptitudemo ? item.idaptitudemo : 0;
    
    // forkJoin({
    //   listaptitud: this.solicitarService.listAptitudEMO()
    // }).subscribe({
    //   next: ({ listaptitud }) => {
    //     this.listaptitud = listaptitud;
    //     // const foundItem = this.listaptitud.find(a => a.idaptitudemo === item.idaptitudemo);
    //     this.aptitud = item.idaptitudemo ? item.idaptitudemo : 0; // Guarda el id o null si no se encontró
    //   },
    //   error: error => {
    //     Swal.fire(
    //       'Error',
    //       'Error al cargar los datos: ' + error.message,
    //       'error'
    //     );
    //   }
    // });
  }

private updateFormValidators() {
  if (this.aptitud === 3) {
    this.myForm.get('tnombespe').setValidators([Validators.required]);
    this.myForm.get('tnombrest').setValidators([Validators.required]);
  } else {
    this.myForm.get('tnombespe').clearValidators();
    this.myForm.get('tnombrest').clearValidators();
  }

  this.myForm.get('tnombespe').updateValueAndValidity();
  this.myForm.get('tnombrest').updateValueAndValidity();
}

  listAptitudAO() {
    this.solicitarService.listAptitudEMO().subscribe(
      resp => {
        this.listaptitud = resp;
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

  onKeyEspecialidad(event: any) {
    if(event.target.value.length >= 3) {
      this.likeEspecialidad_AO(event.target.value);
    }
  }

  onKeyRestriccion(event: any) {
    if(event.target.value.length >= 3) {
      this.likeRestriccion_AO(this.myForm.value.tnombespe.idespecialidad ,event.target.value);
    }
  }

  likeEspecialidad_AO(tnombespe: string) {
    this.solicitarService.listEspecialidad(tnombespe).subscribe(
      resp => {
        this.likeEspecialidad = resp;
        if (this.likeEspecialidad.length > 0) {
          this.listespecialidad = this.likeEspecialidad.map(item => ({
            idespecialidad: item.idespecialidad,
            tnombespe: item.tnombespe
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

  likeRestriccion_AO(idespecialidad: number, tnombespe: string) {
    this.solicitarService.listRestriccion(idespecialidad, tnombespe).subscribe(
      resp => {
        this.likeRestriccion = resp;
        if (this.likeRestriccion.length > 0) {
          this.listrestriccion = this.likeRestriccion.map(item => ({
            idrestriccion: item.idrestriccion,
            tnombrest: item.tnombrest
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

  addTagFnEspe(tnombespe: string) {
    // Crea un objeto temporal para mostrar en el select inmediatamente
    const tempItem = { idespecialidad: null, tnombespe: tnombespe };
    this.listespecialidad.push(tempItem);
    // this.selectedItem = tempItem; // Selecciona el nuevo item temporalmente

    // Crea el objeto para la llamada al servicio
    let insert = {
      tnombespe: tnombespe,
      tdescespe: null,
      tcodipersregi: this.sesion.tcodipers // Ajusta esto según tus necesidades
    };
    
    // Llamada al servicio para agregar el nuevo valor
    this.solicitarService.agreEspecialidad(insert).subscribe(
      resp => {
        var objeResp: any = resp;
        console.log(objeResp);

        // Actualiza el objeto temporal con el ID recibido del servicio
        tempItem.idespecialidad = objeResp.primaryKey;
        
        Swal.fire({
          title: 'Éxito',
          text: objeResp.message,
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
        this.listespecialidad = this.listespecialidad.filter(item => item !== tempItem);
      }
    );

    // Retorna el objeto temporal para que ng-select lo maneje inmediatamente
    return tempItem;
  }

  addTagFnRest(tnombrest: string) {
    // Crea un objeto temporal para mostrar en el select inmediatamente
    const tempItem = { idrestriccion: null, tnombrest: tnombrest };
    this.listrestriccion.push(tempItem);
    // this.selectedItem = tempItem; // Selecciona el nuevo item temporalmente

    // Crea el objeto para la llamada al servicio
    let insert = {
      idespecialidad: this.myForm.value.tnombespe.idespecialidad,
      tnombrest: tnombrest,
      tdescrest: null,
      tstatus: 1,
      tcodipersregi: this.sesion.tcodipers, // Ajusta esto según tus necesidades
    };
    
    // Llamada al servicio para agregar el nuevo valor
    this.solicitarService.agreRestriccion(insert).subscribe(
      resp => {
        var objeResp: any = resp;
        console.log(objeResp);

        // Actualiza el objeto temporal con el ID recibido del servicio
        tempItem.idrestriccion = objeResp.primaryKey;
        
        Swal.fire({
          title: 'Éxito',
          text: objeResp.message,
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
        this.listrestriccion = this.listrestriccion.filter(item => item !== tempItem);
      }
    );

    // Retorna el objeto temporal para que ng-select lo maneje inmediatamente
    return tempItem;
  }

  submitForm() {
    this.modalFormSubmitted = true;
    if (this.myForm.invalid) {
      return;
    }
    console.log(this.myForm.value)
    // this.myForm.value.documento = this.profileImage;
    this.activeModal.close(this.myForm.value);
  }

  changeApti(obje: any) {
    this.aptitud = obje ? obje.idaptitudemo : 0;
    this.updateFormValidators();
  }


}

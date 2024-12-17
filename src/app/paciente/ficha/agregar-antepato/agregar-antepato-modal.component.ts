import { Component, Output, EventEmitter, Input, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
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
  selector: 'app-agregar-antepato-modal',
  templateUrl: './agregar-antepato-modal.component.html',
  styleUrls: ['./agregar-antepato-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
    SolicitarService
  ]
})
export class AgregarAntepatoModalComponent implements OnInit{

  type = 'Marketing';
  @Input() id: number;
  @Input() data: {};
  myForm: UntypedFormGroup;
  d2: any;
  control = [
    { id: 0, name: 'No' },
    { id: 1, name: 'Si' }
  ];
  listantepato = [];
  likeAntePato: any = [];
  sesion: any;

  constructor(
   public activeModal: NgbActiveModal,
   private formBuilder: UntypedFormBuilder,
   private changeDetector:ChangeDetectorRef,
   private solicitarService: SolicitarService,
   private authService: AuthService
  ) { }

  ngOnInit() {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.buildItemForm(this.data);
  }
  
  // imageUpload(event:any) {
  //   var file = event.target.files.length;
  //   for(let i=0;i<file;i++)
  //   {
  //      var reader = new FileReader();
  //      reader.onload = (event:any) => 
  //      {
  //          this.profileImage = event.target.result;
  //          this.changeDetector.detectChanges();
  //      }
  //      reader.readAsDataURL(event.target.files[i]);
  //   }
  // }

  get lf() {
    // //console.log(this.myForm.controls)
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
      tdescantepato: [item.tdescantepato || null, Validators.required],
      tflagcontrol: [item.tflagcontrol || null, Validators.required],
      tfechulticont: [item.tfechulticont || '', Validators.required],
      tcanttotacont: [item.tcanttotacont || null],
      tobservacion: [item.tobservacion || null]
    });
    // this.profileImage = this.myForm.value.documento;
  }

  submitForm() {
    // this.modalPermFormSubmitted = true;
    // if (this.myForm.invalid) {
    //   return;
    // }
    // this.myForm.value.documento = this.profileImage;
    this.activeModal.close(this.myForm.value);
  }

  addTagFn(tdescantepato: string) {
    // Crea un objeto temporal para mostrar en el select inmediatamente
    const tempItem = { idantepato: null, tdescantepato: tdescantepato };
    this.listantepato.push(tempItem);
    // this.selectedItem = tempItem; // Selecciona el nuevo item temporalmente

    // Crea el objeto para la llamada al servicio
    let insert = {
      tdescantepato: tdescantepato,
      tcodipersregi: this.sesion.tcodipers // Ajusta esto según tus necesidades
    };
    
    // Llamada al servicio para agregar el nuevo valor
    this.solicitarService.agreAntePato(insert).subscribe(
      resp => {
        var objeResp: any = resp;
        console.log(objeResp);

        // Actualiza el objeto temporal con el ID recibido del servicio
        tempItem.idantepato = objeResp.primaryKey;
        
        Swal.fire({
          title: 'Éxito',
          text: 'Antecedente Patológico agregado',
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
        this.listantepato = this.listantepato.filter(item => item !== tempItem);
      }
    );

    // Retorna el objeto temporal para que ng-select lo maneje inmediatamente
    return tempItem;
  }

  onKeyAntePato(event: any) { // without type info
    if(event.target.value.length >= 3) {
      this.likeAntePatoXPers(event.target.value);
    }
  }

  likeAntePatoXPers(tdescantepato: string){
    this.solicitarService.likeAntePatoXPers(tdescantepato).subscribe(
      resp => {
        this.likeAntePato = resp;
        if (this.likeAntePato.length > 0) {
          this.listantepato = this.likeAntePato.map(item => ({
            idantepato: item.idantepato,
            tdescantepato: item.tdescantepato
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

  agreAntePato(tdescantepato: string){
    let insert = {
      tdescantepato: tdescantepato,
      tcodipersregi: this.sesion.tcodipers
    }
    this.solicitarService.agreAntePato(insert).subscribe(
      resp => {
        var objeResp: any = resp;
        console.log(objeResp)
        const newItem = {idantepato: objeResp.primaryKey, tdescantepato: name};
        this.listantepato.push(newItem);
        Swal.fire({
          title: 'Exito',
          text: 'Antecedente Patologico agregado',
          icon: 'success',
          timer: 1500, 
          showConfirmButton: false,
        })
        return newItem;
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

}

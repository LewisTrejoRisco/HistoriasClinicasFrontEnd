import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef, Injectable } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { ModalDismissReasons, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { ACTUALIZAR_USUARIO, DELETE_ATENCIONMEDICA, DELETE_USUARIO, INSERT_ATENCIONMEDICA, INSERT_USUARIO, LISTAR_ATENCIONMEDICA, LISTAR_PUESTO, LISTAR_ROL, LISTAR_USUARIO, UPDATE_ATENCIONMEDICA } from 'app/shared/utilitarios/Constantes';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
// import { CancelarModalComponent } from '../cancelarModal/cancelar-modal.component';
const I18N_VALUES = {
  es: {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: [
      'Enero', 'Febrer', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septie', 'Octubr', 'Noviem', 'Diciem'
    ],
  }
};

// @Injectable()
// export class CustomDatepickerI18n extends NgbDatepickerI18n {

//   getWeekdayShortName(weekday: number): string {
//     return I18N_VALUES.es.weekdays[weekday - 1];
//   }
//   getMonthShortName(month: number): string {
//     return I18N_VALUES.es.months[month - 1];
//   }
//   getMonthFullName(month: number): string {
//     return this.getMonthShortName(month);
//   }
//   getDayAriaLabel(date: NgbDateStruct): string {
//     return `${date.day}-${date.month}-${date.year}`;
//   }
// }
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
      ? this.formatNumberToTwoDigits(date.day) + this.DELIMITER + this.formatNumberToTwoDigits(date.month) + this.DELIMITER + date.year
      : '';
  }

  formatNumberToTwoDigits(number: number): string {
    return number.toString().padStart(2, '0');
  }
}

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
    SolicitarService
  ]
})
export class AuditoriaComponent implements OnInit {

  sesion: any;
  // PERSONA A BUSCAR
  // usuarioSolicitar: any = null;
  // listPersona: any = [];
  // codigoTrabajador: string = null;
  // ATENCION MEDICA
  // listatenmedi: any = []
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  transaccion: any;
  @ViewChild('modalRegistrar') modalRegistrar: TemplateRef<any>;
  flagformtransaccion: boolean = false;
  // flagAtencionMedica: boolean = false;
  d2: any;


  listUsua: any = [];
  listPues: any = [];
  listRol: any = [];
  flagtrans: boolean = false;

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private authService: AuthService,
    private modal: NgbModal) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.listarUsuariosAplicacion();
    this.listarModalAplicacion();
  }

  listarUsuariosAplicacion() {
    let path = LISTAR_USUARIO;
    forkJoin({
      listUsua: this.solicitarService.listarfindall(path)
    }).subscribe({
      next: ({ listUsua }) => {
        this.listUsua = listUsua;
      },
      error: error => {
        Swal.fire(
          'Error',
          'Error al cargar emo: ' + error.message,
          'error'
        );
      }
    });
  }

  listarModalAplicacion() {
    let path = LISTAR_PUESTO;
    let pathRol = LISTAR_ROL;
    forkJoin({
      listPues: this.solicitarService.listarfindall(path),
      listRol: this.solicitarService.listarfindall(pathRol)
    }).subscribe({
      next: ({ listPues, listRol }) => {
        this.listPues = listPues;
        this.listRol = listRol;
      },
      error: error => {
        Swal.fire(
          'Error',
          'Error al cargar emo: ' + error.message,
          'error'
        );
      }
    });
  }

  modalAgregarAtencion(accion: number, row: any) {
    if (accion == 0) {
      this.flagtrans = false ; 
      this.createTransaccion();
    } else {
      this.flagtrans = true ; 
      this.updateTransaccion(row);
    }
  }

  createTransaccion() {
    this.transaccion = {
      tcodipues: null,
      idRol: null,
      tstatus: null,
      tusuaregi: this.sesion.tcodipers,
      tusuaactu: null
    }
    this.handleTransaccion('Registrar', 'Registrar', this.transaccion);
  }

  updateTransaccion(row: any) {
    this.transaccion = {
      tcodipues: row.tcodipues,
      idRol: row.idRol,
      tstatus: row.tstatus,
      tusuaregi: null,
      tusuaactu: this.sesion.tcodipers
    }
    this.handleTransaccion('Actualizar', 'Actualizar', this.transaccion);
  }

  handleTransaccion(titulo: string, action: string, transaccion: any): void {
    this.modalDataRese = { titulo, action, transaccion};
    this.modal.open(this.modalRegistrar, { size: 'md' });
  }

  modalDataRese: {
    titulo: string,
    action: string;
    transaccion: any
  };
  
  registrar(form: NgForm): void {
    this.flagformtransaccion = true;
    if (form.invalid) {
      return;
    }
    let objeinsert = {
      tcodipues: this.modalDataRese.transaccion.tcodipues,
      idRol: this.modalDataRese.transaccion.idRol,
      tstatus: this.modalDataRese.transaccion.tstatus,
      tusuaregi: this.modalDataRese.transaccion.tusuaregi,
      tusuaactu: this.modalDataRese.transaccion.tusuaactu,
    };

    if (this.modalDataRese.transaccion.tstatus == null) {
      this.metoRegistro(objeinsert);
    } else {
      this.metoActualizar(objeinsert);
    }
  }

  metoRegistro(objeinsert: any) {
    let path = INSERT_USUARIO;
    forkJoin({
      response: this.solicitarService.agregar(path,objeinsert)
    }).subscribe({
      next: ({ response }) => {
        let respuesta:any = null;
        respuesta = response;
        if(respuesta.httpcode == 200) {
          this.flagformtransaccion = false;
          this.listarUsuariosAplicacion();
          this.modal.dismissAll();
          Swal.fire({
            title: 'Exito',
            text: respuesta.message,
            icon: 'success',
            timer: 1000, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            respuesta.message,
            'error'
          );
        }
      },
      error: error => {
        Swal.fire(
          'Error',
          'Error al registrar: ' + error.message,
          'error'
        );
      }
    });
  }

  metoActualizar(objeinsert: any) {
    let path = ACTUALIZAR_USUARIO;
    forkJoin({
      response: this.solicitarService.actualizar(path,objeinsert)
    }).subscribe({
      next: ({ response }) => {
        let respuesta:any = null;
        respuesta = response;
        if(respuesta.httpcode == 200) {
          this.flagformtransaccion = false;
          this.listarUsuariosAplicacion();
          this.modal.dismissAll();
          Swal.fire({
            title: 'Exito',
            text: respuesta.message,
            icon: 'success',
            timer: 1000, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            respuesta.message,
            'error'
          );
        }
      },
      error: error => {
        Swal.fire(
          'Error',
          'Error al actualizar: ' + error.message,
          'error'
        );
      }
    });
  }

  onCheckboxChange(row: any, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    let objeinsert = {
      tcodipues: row.tcodipues,
      idRol: row.idRol,
      tstatus: checked ? 1 : 0,
      tusuaregi: null,
      tusuaactu: this.sesion.tcodipers,
    };
    // console.log(objeinsert)
    this.metoActualizar(objeinsert);
  }

  onCheckboxChangeModal(row: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.modalDataRese.transaccion.tstatus = checked ? 1 : 0;
  }

  modalEliminar(row: any) {
    // console.log(row)
    Swal.fire({
      title: '¿Estás seguro de eliminar el puesto de ' + row.tdescpues + 'como ' + row.descripcion + '?',
      text: 'No podrás revertir esto después.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let path = DELETE_USUARIO;
        let objeliminar = {
          tcodipues: row.tcodipues,
          idRol: row.idRol,
          tcodipers: this.sesion.tcodipers
        }
        forkJoin({
          response: this.solicitarService.eliminar(path,objeliminar)
        }).subscribe({
          next: ({ response }) => {
            let respuesta:any = null;
            respuesta = response;
            if(respuesta.httpcode == 200) {
              this.flagformtransaccion = false;
              this.listarUsuariosAplicacion();
              this.modal.dismissAll();
              Swal.fire({
                title: 'Exito',
                text: respuesta.message,
                icon: 'success',
                timer: 1000, 
                showConfirmButton: false,
              })
            } else {
              Swal.fire(
                'Error',
                respuesta.message,
                'error'
              );
            }
          },
          error: error => {
            Swal.fire(
              'Error',
              'Error al eliminar: ' + error.message,
              'error'
            );
          }
        });
      }
    });
    // }).catch((error) => {
    //   console.log(error);
    // });
  }

}

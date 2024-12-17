import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { DELETE_ATENCIONMEDICA, INSERT_ATENCIONMEDICA, LISTAR_ATENCIONMEDICA, UPDATE_ATENCIONMEDICA } from 'app/shared/utilitarios/Constantes';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { CancelarModalComponent } from '../cancelarModal/cancelar-modal.component';

@Component({
  selector: 'app-atencion-medica',
  templateUrl: './atencion-medica.component.html',
  styleUrls: ['./atencion-medica.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class AtencionMedicaComponent implements OnInit {

  sesion: any;
  // PERSONA A BUSCAR
  usuarioSolicitar: any = null;
  listPersona: any = [];
  codigoTrabajador: string = null;
  // ATENCION MEDICA
  listatenmedi: any = []
  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  transaccion: any;
  @ViewChild('modalRegistrar') modalRegistrar: TemplateRef<any>;
  flagformtransaccion: boolean = false;
  flagAtencionMedica: boolean = false;

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private authService: AuthService,
    private modal: NgbModal) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.usuarioSolicitar = JSON.parse(this.authService.userUsuarioExpediente);
    if (this.usuarioSolicitar != null) {
      this.codigoTrabajador = this.usuarioSolicitar.tcodipers;
      this.listarAtencionMedica();
    }
  }

  onKeynombcomp(event: any) { // without type info
    if(event.target.value.length >= 3) {
      this.likePersXNomb(event.target.value);
    }
  }

  selecUsuario(selectedItem: any) {
    this.codigoTrabajador = selectedItem.tcodipers;
    this.authService.guardarUsuarioExpediente(JSON.stringify(this.usuarioSolicitar))
  }

  likePersXNomb(tnombcomp: string) {
    this.solicitarService.listColaByTnomb(tnombcomp).subscribe(
      resp => {
        this.listPersona = resp;
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

  onKeycodigo(event: any) {
    if(event.target.value.length >= 7) {
      this.likePersXCodigo(event.target.value.toUpperCase());
    }
  }

  likePersXCodigo(tcodiusua: string) {
    this.solicitarService.listXColaborador("000" + tcodiusua).subscribe(
      resp => {
        this.usuarioSolicitar = resp;
        this.codigoTrabajador = this.usuarioSolicitar.tcodipers;
        this.authService.guardarUsuarioExpediente(JSON.stringify(this.usuarioSolicitar))
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

  listarAtencionMedica() {
    let path = LISTAR_ATENCIONMEDICA;
    let param = "?tcodipers=" + this.usuarioSolicitar.tcodipers;
    forkJoin({
      listatenmedi: this.solicitarService.listar(path, param)
    }).subscribe({
      next: ({ listatenmedi }) => {
        this.listatenmedi = listatenmedi;
        this.flagAtencionMedica = true
        console.log(this.listatenmedi)
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
      this.createTransaccion();
    } else {
      this.updateTransaccion(row);
    }
  }

  createTransaccion() {
    this.transaccion = {
      idatenmedi: null,
      tdiagnostico: null,
      tdescmedi: null,
      tdescatenmedi: null
    }
    this.handleTransaccion('Registrar', 'Registrar', this.transaccion);
  }

  updateTransaccion(row: any) {
    this.transaccion = {
      idatenmedi: row.idatenmedi,
      tdiagnostico: row.tdiagnostico,
      tdescmedi: row.tdescmedi,
      tdescatenmedi: row.tdescatenmedi
    }
    this.handleTransaccion('Actualizar', 'Actualizar', this.transaccion);
  }
  // int idatenmedi;
  //   String tcodipers;
  //   String tdescunidfunc;
  //   String tdiagnostico;
  //   int tdescmedi;
  //   String tdescatenmedi;
  //   String tcodipersregi;
  //   String tfechregi;

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
    console.log(this.modalDataRese.transaccion);
    this.flagformtransaccion = true;
    if (form.invalid) {
      return;
    }
    let objeinsert = {
      idatenmedi: this.modalDataRese.transaccion.idatenmedi,
      tcodipers: this.usuarioSolicitar.tcodipers,
      tdescunidfunc: this.usuarioSolicitar.tnombunidfunc,
      tdiagnostico: this.modalDataRese.transaccion.tdiagnostico,
      tdescmedi: this.modalDataRese.transaccion.tdescmedi,
      tdescatenmedi: this.modalDataRese.transaccion.tdescatenmedi,
      tcodipersregi: this.sesion.tcodipers
    };

    console.log(objeinsert)
    if (objeinsert.idatenmedi == null) {
      this.metoRegistro(objeinsert);
    } else {
      this.metoActualizar(objeinsert);
    }
  }

  metoRegistro(objeinsert: any) {
    let path = INSERT_ATENCIONMEDICA;
    forkJoin({
      response: this.solicitarService.agregar(path,objeinsert)
    }).subscribe({
      next: ({ response }) => {
        let respuesta:any = null;
        respuesta = response;
        if(respuesta.httpcode == 200) {
          this.flagformtransaccion = false;
          this.listarAtencionMedica();
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
    let path = UPDATE_ATENCIONMEDICA;
    forkJoin({
      response: this.solicitarService.actualizar(path,objeinsert)
    }).subscribe({
      next: ({ response }) => {
        let respuesta:any = null;
        respuesta = response;
        if(respuesta.httpcode == 200) {
          this.flagformtransaccion = false;
          this.listarAtencionMedica();
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

  modalEliminar(row: any) {
    let path = DELETE_ATENCIONMEDICA;
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'la atención médica'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      let objRechazar = {
        idatenmedi: row.idatenmedi
      }
      console.log(objRechazar);
      
    forkJoin({
      response: this.solicitarService.eliminar(path,objRechazar)
    }).subscribe({
      next: ({ response }) => {
        let respuesta:any = null;
        respuesta = response;
        if(respuesta.httpcode == 200) {
          this.flagformtransaccion = false;
          this.listarAtencionMedica();
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
    }).catch((error) => {
      console.log(error);
    });
  }

}

import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormArray, FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType
} from '@swimlane/ngx-datatable';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import Swal from 'sweetalert2';
import { AgregarAntepatoModalComponent } from './agregar-antepato/agregar-antepato-modal.component';
import { AgregarAnteOcupModalComponent } from './agregar-anteocup/agregar-anteocup-modal.component';
import { AgregarAcciLaboModalComponent } from './agregar-accilabo/agregar-accilabo-modal.component';
import { AgregarVacunaModalComponent } from './agregar-vacuna/agregar-vacuna-modal.component';
import { AgregarAnteOcupAptitudModalComponent } from './agregar-anteocup-aptitud/agregar-anteocup-aptitud-modal.component';
import { CancelarModalComponent } from '../cancelarModal/cancelar-modal.component';
import { forkJoin } from 'rxjs';
import { AgregarGestanteModalComponent } from './agregar-gestante/agregar-gestante-modal.component';
import { DELETE_GESTANTE, INSERT_GESTANTE, LISTAR_GESTANTE, UPDATE_GESTANTE } from 'app/shared/utilitarios/Constantes';

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class FichaComponent implements OnInit {

  @ViewChild('tableRowDetails') tableRowDetails: any;
  public ColumnMode = ColumnMode;
  // SESION LOGIN
  sesion: any;
  // PERSONA A BUSCAR
  usuarioSolicitar: any = null;
  listPersona: any = [];
  codigoTrabajador: string = null;
  // tnombcomp: string = null;
  // MI FORMULARIO PERSONAL
  myForm: UntypedFormGroup;
  // LISTA ANTECEDENTES PATOLOGICOS
  listAntePatoXPers: any = [];
  firstEMO: any = {};
  listAlerXPers: any = [];
  objeEMOXPersAO: any = null;
  tstatusActive: number = 1;
  listEmoXPersLast: any = [];
  // LISTAR ACCIDENTES LABORALES
  listAccidenteLaboral: any = [];
  // LISTAR VACUNA
  listVacuna: any = [];
  // GESTANTE
  listgestante: any = [];
  firstGestante: any = [];
  restGestante: any = [];
  // BOOLEAN PARA DETALLE DE PACIENTE
  flagDetalle: boolean = false;

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private authService: AuthService,
    private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userSesion);
    this.usuarioSolicitar = JSON.parse(this.authService.userUsuarioExpediente);
    if (this.usuarioSolicitar != null) {
      this.codigoTrabajador = this.usuarioSolicitar.tcodipers;
      this.listarTablas();
    }
  }

  get lf() {
    return this.myForm.controls;
  }

  private buildUserForm(item:any, firstEMO:any) {
    this.myForm = this.formBuilder.group({
      tcodipers: [item.tcodipers || null],
      tnombcomp: [item.tnombcomp || null],
      tdescnacionalidad: [item.tdescnacionalidad || null],
      tdescpues: [item.tdescpues || null],
      tfechnaci: [item.tfechnaci || null],
      tmailpers: [item.tmailpers || null],
      tmailtrab: [item.tmailtrab || null],
      tnombunidfunc: [item.tnombunidfunc || null],
      ttipodocuiden: [item.ttipodocuiden || null],
      tnumedocuiden: [item.tnumedocuiden || null],
      tsexo: [item.tsexo || null],
      tubicfisi: [item.tubicfisi || null],
      emo: [firstEMO.tfechinic || null]
    });
  }

  listarTablas() {
    // INFORMACION PERSONAL => EMO REGISTRO
    this.listEmoXPers(this.usuarioSolicitar.tcodipers)
    // INFORMACION PERSONAL => ALERGIAS
    this.listarAlerXPers(this.usuarioSolicitar.tcodipers);
    // ANTECEDENTES PATOLOGICOS => 
    // this.listarAntePatoXPers(this.usuarioSolicitar.tcodipers);
    this.listarAntePatoXPers(this.usuarioSolicitar.tcodipers);
    // ANTECEDENTES OCUPACIONALES => EMO FIRST, LAST AND EMO PERIODICO
    this.listEMOXPersAnteOcup(this.usuarioSolicitar.tcodipers);
    // ACCIDENTES LABORALES
    this.listAccidentesLaborales(this.usuarioSolicitar.tcodipers)
    // VACUNAS
    this.listVacunasXPersona(this.usuarioSolicitar.tcodipers);
    // GESTANTE
    this.listGestante(this.usuarioSolicitar.tcodipers)
    this.flagDetalle = true;
  }

  onKeycodigo(event: any) {
    if(event.target.value.length >= 7) {
      this.likePersXCodigo(event.target.value.toUpperCase());
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

  likePersXCodigo(tcodiusua: string) {
    console.log(tcodiusua);
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

  listEmoXPers(tcodipers:string) {
    this.solicitarService.listEmoXPers(tcodipers, 'first').subscribe(
      resp => {
        this.firstEMO = resp;
        this.buildUserForm(this.usuarioSolicitar, this.firstEMO);
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

  listarAlerXPers(tcodipers:string) {
    this.solicitarService.listAlerXPers(tcodipers, 1).subscribe(
      resp => {
        this.listAlerXPers = resp;
        console.log(this.listAlerXPers);

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

  listarAntePatoXPers(tcodipers:string){
    this.solicitarService.listarAntePatoXPers(tcodipers).subscribe(
      resp => {
        console.log(resp);
        this.listAntePatoXPers = resp;
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

  listEMOXPersAnteOcup(tcodipers:string){
    this.solicitarService.listEMOXPersAnteOcup(tcodipers).subscribe(
      resp => {
        console.log(tcodipers + ": EMO Actualizar" );
        console.log(resp);
        this.objeEMOXPersAO = resp;
        this.listEMOXPersLastAnteOcup(this.objeEMOXPersAO.idhistemoxperslast)
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

  listEMOXPersLastAnteOcup(idhistemoxpers:number){
    this.solicitarService.findByIdHistEmoXPers(idhistemoxpers, this.tstatusActive).subscribe(
      resp => {
        console.log(resp);
        this.listEmoXPersLast = resp;
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

  listAccidentesLaborales(tcodipers:string){
    this.solicitarService.listAccidentesLaborales(tcodipers).subscribe(
      resp => {
        console.log(resp);
        this.listAccidenteLaboral = resp;
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

  listVacunasXPersona(tcodipers:string){
    this.solicitarService.listVacunasXPers(tcodipers).subscribe(
      resp => {
        console.log(resp);
        this.listVacuna = resp;
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

  listGestante(tcodipers:string){
    console.log(this.usuarioSolicitar)
    let path = LISTAR_GESTANTE;
    let param = "?tcodipers=" + tcodipers;
    forkJoin({
      listgestante: this.solicitarService.listar(path, param)
    }).subscribe({
      next: ({ listgestante }) => {
        this.listgestante = listgestante;
        this.firstGestante = listgestante.length > 0 ? [listgestante[0]] : []; // Primer valor
        this.restGestante = listgestante.length > 1 ? listgestante.slice(1) : []; // Resto de los valores
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

// ANTECEDENTE PATOLOGICO

  modalAgregarAntePato(tipo: any, row:any) {
    console.log(row)
    let tfechulticont = null;
    let tflagcontrol = null;
    let tdescantepato = null;
    let tcanttotacont = null;
    let tobservacion = null;
    if (row != null) {
      if(row.tfechulticont.split('/').length == 3){
        tfechulticont = {
          "year": parseInt(row.tfechulticont.split('/')[2]),
          "month": parseInt(row.tfechulticont.split('/')[1]),
          "day": parseInt(row.tfechulticont.split('/')[0])
        };
      }
      if (row.tflagcontrol != null) {
        tflagcontrol = {
          id: row.tflagcontrol, 
          name: row.tflagcontrol == 0 ? 'No' : 'Si'
        }
      }
      if (row.tdescantepato != null) {
        tdescantepato = {
          idantepato: row.idantepato, 
          tdescantepato: row.tdescantepato
        }
      }
      if (row.tcanttotacont != null){
        tcanttotacont = row.tcanttotacont;
      }
      if (row.tobservacion != null){
        tobservacion = row.tobservacion;
      }
    }
    const modalRef = this.modalService.open(AgregarAntepatoModalComponent);
    modalRef.componentInstance.id = tipo;
    modalRef.componentInstance.data = { tdescantepato: tdescantepato, 
                                        tflagcontrol: tflagcontrol, 
                                        tfechulticont: tfechulticont, 
                                        tcanttotacont: tcanttotacont,
                                        tobservacion: tobservacion
                                      }
    modalRef.result.then((result) => {
      let objeInse = null;
      objeInse = {
          tcodipers: this.usuarioSolicitar.tcodipers,
          idantepato: result.tdescantepato.idantepato,
          tflagcontrol: result.tflagcontrol.id,
          tfechulticont: result.tfechulticont == null ? null : result.tfechulticont.day + '/' + result.tfechulticont.month + '/' + result.tfechulticont.year,
          tcanttotacont: result.tcanttotacont,
          tcodipersregi: this.sesion.tcodipers,
          tobservacion: result.tobservacion
      }
      if (tipo == 0) {
        this.agreAntePatoXPers(objeInse);
      } else {
        this.actuAntePatoXPers(objeInse);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  agreAntePatoXPers(objeInse: any) {
    this.solicitarService.agreAntePatoXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listarAntePatoXPers(this.usuarioSolicitar.tcodipers);
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  actuAntePatoXPers(objeInse: any) {
    this.solicitarService.actuAntePatoXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listarAntePatoXPers(this.usuarioSolicitar.tcodipers);
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  borrAntePatoXPers(objeInse: any) {
    this.solicitarService.borrAntePatoXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listarAntePatoXPers(this.usuarioSolicitar.tcodipers);
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  modalEliminar(user: any){
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'el antecedente patológico'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      let objRechazar = {
        tcodipers: user.tcodipers,
        idantepato: user.idantepato
      }
      console.log(objRechazar);
      this.solicitarService.borrAntePatoXPers(objRechazar).subscribe(
        resp => {
          //console.log(resp)
          this.listarAntePatoXPers(this.usuarioSolicitar.tcodipers);
        }, 
        error => {
          //console.log("Error: " + error.message)
          Swal.fire(
            'Error',
            'error al eliminar:'+ error.message,
            'error'
          );
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

  // ANTECEDENTES OCUPACIONALES
  // => EMO

  modalAgregarAnteOcup(tipo: any, row:any) {
    let tfechinic = null;
    let tcantanua = null;
    let documento = null;
    let documentoinf = null;
    let tnombespe = null;
    let tnombrest = null;
    let idaptitudemo = null;
    let tfechalimite = null;
    let tstatus = null;
    let tdescemo = null;
    let tfechrese = null;
    let tflagentrresu = null;
    // row = this.objeEMOXPersAO;
    console.log(row)
    console.log(this.objeEMOXPersAO)
    console.log(this.listEmoXPersLast)
    if (row != null) {
      if(row.tfechiniclast != null) {
        if(row.tfechiniclast.split('/').length == 3){
          tfechinic = {
            "year": parseInt(row.tfechiniclast.split('/')[2]),
            "month": parseInt(row.tfechiniclast.split('/')[1]),
            "day": parseInt(row.tfechiniclast.split('/')[0])
          };
        }
      }
      if (row.tcantanualast != null){
        tcantanua = row.tcantanualast;
      }
      if (row.tdocuapti != null){
        documento = row.tdocuapti;
      }
      if (row.tdocuresuinfo != null){
        documentoinf = row.tdocuresuinfo;
      }
      if (row.idaptitudemo != null){
        idaptitudemo =  row.idaptitudemo;
      }
      if (row.tdescemo != null){
        tdescemo =  row.tdescemo;
      }
      if(row.tfechrese != null) {
        if(row.tfechrese.split('/').length == 3){
          tfechrese = {
            "year": parseInt(row.tfechrese.split('/')[2]),
            "month": parseInt(row.tfechrese.split('/')[1]),
            "day": parseInt(row.tfechrese.split('/')[0])
          };
        }
      }
      if (row.tflagentrresu != null){
        tflagentrresu =  row.tflagentrresu;
      }
    }

    const modalRef = this.modalService.open(AgregarAnteOcupModalComponent);
    modalRef.componentInstance.id = tipo;
    modalRef.componentInstance.data = { tfechinic: tfechinic, 
                                        tcantanua: tcantanua,
                                        documento: documento,
                                        documentoinf: documentoinf,
                                        idaptitudemo: idaptitudemo,
                                        tnombespe: tnombespe,
                                        tnombrest: tnombrest,
                                        tfechalimite: tfechalimite,
                                        tstatus: tstatus,
                                        tdescemo: tdescemo,
                                        tfechrese: tfechrese,
                                        tflagentrresu: tflagentrresu
                                      }
    modalRef.result.then((result) => {
      console.log(result)
      let objeInse = null;
      objeInse = {
        idhistemoxpers: row == null ? null : row.idhistemoxperslast,
        tcodipers: this.usuarioSolicitar.tcodipers,
        tfechinic: result.tfechinic == null ? null : result.tfechinic.day + '/' + result.tfechinic.month + '/' + result.tfechinic.year,
        tcantanua: result.tcantanua,
        tcodipersregi: this.sesion.tcodipers,
        tstatus: 1,
        tdocuapti:  result.documento,
        tdocuresuinfo:  result.documentoinf,
        tcodipersactu: this.sesion.tcodipers,
        idaptitudemo: result.idaptitudemo,
        tdescemo: result.tdescemo,
        tfechrese: result.tfechrese == null ? null : result.tfechrese.day + '/' + result.tfechrese.month + '/' + result.tfechrese.year,
        tflagentrresu: result.tflagentrresu ? 1: 0
      }
      let objeActu = null;
      objeActu = {
        idhistemoxpers: null,
        idrestriccion: result.tnombrest ? result.tnombrest.idrestriccion : null,
        tfechalimite: result.tfechalimite == null ? null : result.tfechalimite.day + '/' + result.tfechalimite.month + '/' + result.tfechalimite.year,
        tstatus: result.tstatus == null ? 1: result.tstatus.tstatus,
        tcodipersregi: this.sesion.tcodipers,
        tcodipersactu: this.sesion.tcodipers
      }
      if (tipo == 0) {
        this.agreAnteOcupXPers(objeInse, objeActu);
      } else {
        this.actuAnteOcupXPers(objeInse, objeActu);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  
  agreAnteOcupXPers(objeInse: any, objeActu: any) {
    forkJoin({
      resp: this.solicitarService.agreAnteOcupXPers(objeInse)
    }).subscribe({
      next: ({ resp }) => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          if(objeInse.idaptitudemo != 1) {
            objeActu.idhistemoxpers = response.primaryKey;
            this.agreAnteOcupAptiXPers(objeActu)
          }
          this.listEmoXPers(this.usuarioSolicitar.tcodipers);
          this.listEMOXPersAnteOcup(this.usuarioSolicitar.tcodipers);
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
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

  actuAnteOcupXPers(objeInse: any, objeActu: any) {
    forkJoin({
      resp: this.solicitarService.actuAnteOcupXPers(objeInse)
    }).subscribe({
      next: ({ resp }) => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          if(objeInse.idaptitudemo != 1) {
            objeActu.idhistemoxpers = response.primaryKey;
            this.agreAnteOcupAptiXPers(objeActu)
          }
          this.listEmoXPers(this.usuarioSolicitar.tcodipers);
          this.listEMOXPersAnteOcup(this.usuarioSolicitar.tcodipers);
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
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

  borrAnteOcupXPers(objeInse: any) {
    this.solicitarService.borrAnteOcupXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listEmoXPers(this.usuarioSolicitar.tcodipers);
          this.listEMOXPersAnteOcup(this.usuarioSolicitar.tcodipers);
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  // => APTITUD EMO

  modalAgregarAnteOcupAptitud(tipo: any, row:any) {
    let tnombespe = null;
    let tnombrest = null;
    let idaptitudemo = null;
    let tfechalimite = null;
    let tstatus = null;
    console.log(row)
    console.log(this.objeEMOXPersAO.idaptitudemo)
    if (row != null) {
      if(row.tfechalimite != null){
        if(row.tfechalimite.split('/').length == 3){
          tfechalimite = {
            "year": parseInt(row.tfechalimite.split('/')[2]),
            "month": parseInt(row.tfechalimite.split('/')[1]),
            "day": parseInt(row.tfechalimite.split('/')[0])
          };
        }
      }
      if (row.tnombespe != null){
        tnombespe = {
          "idespecialidad": row.idespecialidad,
          "tnombespe": row.tnombespe
        }
      }
      if (row.tnombrest != null){
        tnombrest = {
          "idrestriccion": row.idrestriccion,
          "tnombrest": row.tnombrest
        }
      }
      if (this.objeEMOXPersAO.idaptitudemo != null){
        idaptitudemo =  this.objeEMOXPersAO.idaptitudemo;
      }
      if (row.tstatus != null){
        tstatus  = {
          "tstatus": row.tstatus,
          "tstatusdesc": row.tstatus == 0 ? 'No' : 'Si'
        }
      }
    }
    const modalRef = this.modalService.open(AgregarAnteOcupAptitudModalComponent);
    modalRef.componentInstance.id = tipo;
    modalRef.componentInstance.data = { 
                                        tnombespe: tnombespe, 
                                        tnombrest: tnombrest, 
                                        idaptitudemo: idaptitudemo, 
                                        tfechalimite: tfechalimite, 
                                        tstatus: tstatus
                                      }
    modalRef.result.then((result) => {
      console.log(result)
      let objeInse = null;
      objeInse = {
        idhistemoxpers: row == null ? this.objeEMOXPersAO.idhistemoxperslast : row.idhistemoxpers,
        idrestriccion: result.tnombrest ? result.tnombrest.idrestriccion : null,
        tfechalimite: result.tfechalimite == null ? null : result.tfechalimite.day + '/' + result.tfechalimite.month + '/' + result.tfechalimite.year,
        tstatus: result.tstatus == null ? 1: result.tstatus.tstatus,
        tcodipersregi: this.sesion.tcodipers,
        tcodipersactu: this.sesion.tcodipers
      }
      console.log(objeInse)
      // this.actuAnteOcupXPers(objeActu);
      if (tipo == 0) {
        this.agreAnteOcupAptiXPers(objeInse);
      } else {
        this.actuAnteOcupAptiXPers(objeInse);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  agreAnteOcupAptiXPers(objeInse: any) {
    this.solicitarService.agreAnteOcupAptiXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listEMOXPersLastAnteOcup(response.primaryKey.split("-")[0])
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } 
        else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        // let response: any = error;
        // Swal.fire(
        //   'Error',
        //   response.message,
        //   'error'
        // );
      }
    )
  }

  actuAnteOcupAptiXPers(objeInse: any) {
    this.solicitarService.actuAnteOcupAptiXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listEmoXPers(this.usuarioSolicitar.tcodipers);
          this.listEMOXPersAnteOcup(this.usuarioSolicitar.tcodipers);
          this.listEMOXPersLastAnteOcup(response.primaryKey.split("-")[0])
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  borrAnteOcupAptiXPers(objeInse: any) {
    this.solicitarService.borrAnteOcupAptiXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listEMOXPersLastAnteOcup(response.primaryKey.split("-")[0])
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  modalEliminarAnteOcupAptiXPers(user: any){
    console.log(user)
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'la aptitud emo'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      let objRechazar = {
        idhistemoxpers: user.idhistemoxpers,
        idrestriccion: user.idrestriccion
      }
      console.log(objRechazar);
      this.solicitarService.borrAnteOcupAptiXPers(objRechazar).subscribe(
        resp => {
          //console.log(resp)
          let response: any = resp;
          this.listEMOXPersLastAnteOcup(response.primaryKey.split("-")[0])
        }, 
        error => {
          //console.log("Error: " + error.message)
          Swal.fire(
            'Error',
            'error al eliminar:'+ error.message,
            'error'
          );
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

  // ACCIDENTE LABORAL
  modalAgregarAcciLabo(tipo: any, row:any) {
    let tfechacci = null; 
    let tdiagnostico = null;
    let treferencia = null;
    let tclasificacion = null;
    let tdescansomedico = null;
    let trestriccionlaboral = null;
    let tindicacionespecial = null;
    let tobservaciones = null;
    let tnombunidfuncorig = this.sesion.tnombunidfunc;
    if (row != null) {
      if (row.tfechacci != null) {
        if(row.tfechacci.split('/').length == 3){
          tfechacci = {
            "year": parseInt(row.tfechacci.split('/')[2]),
            "month": parseInt(row.tfechacci.split('/')[1]),
            "day": parseInt(row.tfechacci.split('/')[0])
          };
        }
      }
      if (row.tdiagnostico != null) {
        tdiagnostico = row.tdiagnostico;
      }
      if (row.tclasificacion != null) {
        tclasificacion = row.tclasificacion;
      }
      if (row.treferencia != null) {
        treferencia = {
          treferencia : row.treferencia,
          tdescreferencia : row.treferencia == 0 ? 'No' : 'Si'
        };
      }
      if (row.tdescansomedico != null) {
        tdescansomedico = row.tdescansomedico;
      }
      if (row.trestriccionlaboral != null) {
        trestriccionlaboral = row.trestriccionlaboral;
      }
      if (row.tindicacionespecial != null) {
        tindicacionespecial = row.tindicacionespecial;
      }
      if (row.tobservaciones != null) {
        tobservaciones = row.tobservaciones;
      }
    }
    const modalRef = this.modalService.open(AgregarAcciLaboModalComponent);
    modalRef.componentInstance.id = tipo;
    modalRef.componentInstance.data = { tfechacci: tfechacci, 
                                        tdiagnostico: tdiagnostico, 
                                        tclasificacion: tclasificacion, 
                                        treferencia: treferencia, 
                                        tdescansomedico: tdescansomedico, 
                                        trestriccionlaboral: trestriccionlaboral, 
                                        tindicacionespecial: tindicacionespecial, 
                                        tobservaciones: tobservaciones
                                      }
    modalRef.result.then((result) => {
      console.log(result)
      let objeInse = null;
      objeInse = {
        idaccilabo: row == null ? null : row.idaccilabo,
        tfechacci: result.tfechacci == null ? null : result.tfechacci.day + '/' + result.tfechacci.month + '/' + result.tfechacci.year,
        tcodipers: this.usuarioSolicitar.tcodipers,
        tdiagnostico: result.tdiagnostico,
        tclasificacion: result.tclasificacion,
        treferencia: result.treferencia == null ? null : result.treferencia.treferencia,
        tdescansomedico: result.tdescansomedico,
        tobservaciones: result.tobservaciones,
        trestriccionlaboral: result.trestriccionlaboral,
        tindicacionespecial: result.tindicacionespecial,
        tnombunidfuncorig: tnombunidfuncorig,
        tcodipersregi: this.sesion.tcodipers,
        tcodipersactu: this.sesion.tcodipers
      }
      console.log(objeInse)
      if (tipo == 0) {
        this.agreAcciLaboXPers(objeInse);
      } else {
        this.actuAcciLaboXPers(objeInse);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  agreAcciLaboXPers(objeInse: any) {
    this.solicitarService.agreAcciLaboXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listAccidentesLaborales(this.usuarioSolicitar.tcodipers)
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  actuAcciLaboXPers(objeInse: any) {
    this.solicitarService.actuAcciLaboXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listAccidentesLaborales(this.usuarioSolicitar.tcodipers)
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  borrAcciLaboXPers(objeInse: any) {
    this.solicitarService.borrAcciLaboXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listAccidentesLaborales(this.usuarioSolicitar.tcodipers)
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  modalEliminarAcciLabo(user: any){
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'el accidente laboral'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      let objRechazar = {
        idaccilabo: user.idaccilabo
      }
      console.log(objRechazar);
      this.solicitarService.borrAcciLaboXPers(objRechazar).subscribe(
        resp => {
          //console.log(resp)
          this.listAccidentesLaborales(this.usuarioSolicitar.tcodipers)
        }, 
        error => {
          //console.log("Error: " + error.message)
          Swal.fire(
            'Error',
            'error al eliminar:'+ error.message,
            'error'
          );
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

  // VACUNA X PERSONA

  modalAgregarVacuXPers(tipo: any, row:any) {
    let tdescvacu = null;
    let tfechapli = null;
    if (row != null) {
      if (row.tdescvacu != null) {
        tdescvacu = {
          idvacuna : row.idvacuna,
          tdescvacu : row.tdescvacu
        };
      }
      if (row.tfechapli != null) {
        if(row.tfechapli.split('/').length == 3){
          tfechapli = {
            "year": parseInt(row.tfechapli.split('/')[2]),
            "month": parseInt(row.tfechapli.split('/')[1]),
            "day": parseInt(row.tfechapli.split('/')[0])
          };
        }
      }
    }

    const modalRef = this.modalService.open(AgregarVacunaModalComponent);
    modalRef.componentInstance.id = tipo;
    modalRef.componentInstance.data = { tdescvacu: tdescvacu, 
                                        tfechapli: tfechapli
                                      }
    modalRef.result.then((result) => {
      console.log(result)
      let objeInse = null;
      objeInse = {
        tcodipers: this.usuarioSolicitar.tcodipers,
        idpersxvacu: row == null ? null : row.idpersxvacu,
        idvacuna: result.tdescvacu.idvacuna,
        tfechapli: result.tfechapli == null ? null : result.tfechapli.day + '/' + result.tfechapli.month + '/' + result.tfechapli.year,
        tcodipersregi: this.sesion.tcodipers,
        tcodipersactu: this.sesion.tcodipers
      }
      console.log(objeInse)
      if (tipo == 0) {
        this.agreVacunaXPersona(objeInse);
      } else {
        this.actuVacunaXPersona(objeInse);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  agreVacunaXPersona(objeInse: any) {
    this.solicitarService.agreVacunasXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listVacunasXPersona(this.usuarioSolicitar.tcodipers)
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  actuVacunaXPersona(objeInse: any) {
    this.solicitarService.actuVacunasXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listVacunasXPersona(this.usuarioSolicitar.tcodipers)
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  borrVacunaXPersona(objeInse: any) {
    this.solicitarService.borrVacunasXPers(objeInse).subscribe(
      resp => {
        let response: any = resp;
        console.log(response)
        if (response.httpcode == 200 ) {
          this.listVacunasXPersona(this.usuarioSolicitar.tcodipers)
          Swal.fire({
            title: 'Exito',
            text: response.message,
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false,
          })
        } else {
          Swal.fire(
            'Error',
            response.message,
            'error'
          );
        }
      },
      error => {
        let response: any = error;
        Swal.fire(
          'Error',
          response.message,
          'error'
        );
      }
    )
  }

  modalEliminarVacunaXPers(user: any){
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'la vacuna'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      let objRechazar = {
        idpersxvacu: user.idpersxvacu
      }
      console.log(objRechazar);
      this.solicitarService.borrVacunasXPers(objRechazar).subscribe(
        resp => {
          //console.log(resp)
          this.listVacunasXPersona(this.usuarioSolicitar.tcodipers)
        }, 
        error => {
          //console.log("Error: " + error.message)
          Swal.fire(
            'Error',
            'error al eliminar:'+ error.message,
            'error'
          );
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

  modalAgregarGestante(tipo: any, row:any) {
    let tnumecontrol = null;
    let tfechcapt = null;
    let tfur = null;
    let tfpp = null;
    let tformobst = null;
    let tsemagest = null;
    let tpeso = null;
    let tpresarte = null;
    let tpulso = null;
    let tconthosp = null;
    let ttelecont = null;
    let ttelefami = null;
    let totros = null;
    let triescovi = null;
    let tcontcovi = null;
    let triesocup = null;
    let tturntrab = null;
    let tanamnesis = null;
    let tindica = null;
    let ttemperatura = null;
    let tau = null;
    let tlcf = null;
    let tmovifeta = null;
    let tsitu = null;
    let tpres = null;
    let tposi = null;
    let tedemmmi = null;
    let tobse = null;
    let tsato = null;
    let tproxcita = null;
    let tfechinicdescprenata = null;
    console.log(row)
    if (row != null) {
      if (row.tnumecontrol != null) {
        tnumecontrol = row.tnumecontrol
      }
      if (row.tfechcapt != null) {
        if(row.tfechcapt.split('/').length == 3){
          tfechcapt = {
            "year": parseInt(row.tfechcapt.split('/')[2]),
            "month": parseInt(row.tfechcapt.split('/')[1]),
            "day": parseInt(row.tfechcapt.split('/')[0])
          };
        }
      }
      if (row.tfur != null) {
        if(row.tfur.split('/').length == 3){
          tfur = {
            "year": parseInt(row.tfur.split('/')[2]),
            "month": parseInt(row.tfur.split('/')[1]),
            "day": parseInt(row.tfur.split('/')[0])
          };
        }
      }
      if (row.tfpp != null) {
        if(row.tfpp.split('/').length == 3){
          tfpp = {
            "year": parseInt(row.tfpp.split('/')[2]),
            "month": parseInt(row.tfpp.split('/')[1]),
            "day": parseInt(row.tfpp.split('/')[0])
          };
        }
      }
      if (row.tformobst != null) {
        tformobst = row.tformobst
      }
      if (row.tsemagest != null) {
        tsemagest = row.tsemagest
      }
      if (row.tpeso != null) {
        tpeso = row.tpeso
      }
      if (row.tpresarte != null) {
        tpresarte = row.tpresarte
      }
      if (row.tpulso != null) {
        tpulso = row.tpulso
      }
      if (row.tconthosp != null) {
        tconthosp = row.tconthosp
      }
      if (row.ttelecont != null) {
        ttelecont = row.ttelecont
      }
      if (row.ttelefami != null) {
        ttelefami = row.ttelefami
      }
      if (row.totros != null) {
        totros = row.totros
      }
      if (row.triescovi != null) {
        triescovi = row.triescovi
      }
      if (row.tcontcovi != null) {
        tcontcovi = row.tcontcovi
      }
      if (row.triesocup != null) {
        triesocup = row.triesocup
      }
      if (row.tturntrab != null) {
        tturntrab = row.tturntrab
      }
      if (row.tanamnesis != null) {
        tanamnesis = row.tanamnesis
      }
      if (row.tindica != null) {
        tindica = row.tindica
      }
      if (row.ttemperatura != null) {
        ttemperatura = row.ttemperatura
      }
      if (row.tau != null) {
        tau = row.tau
      }
      if (row.tlcf != null) {
        tlcf = row.tlcf
      }
      if (row.tmovifeta != null) {
        tmovifeta = row.tmovifeta
      }
      if (row.tsitu != null) {
        tsitu = row.tsitu
      }
      if (row.tpres != null) {
        tpres = row.tpres
      }
      if (row.tposi != null) {
        tposi = row.tposi
      }
      if (row.tedemmmi != null) {
        tedemmmi = row.tedemmmi
      }
      if (row.tanamnesis != null) {
        tanamnesis = row.tanamnesis
      }
      if (row.tsato != null) {
        tsato = row.tsato
      }
      if (row.tproxcita != null) {
        if(row.tproxcita.split('/').length == 3){
          tproxcita = {
            "year": parseInt(row.tproxcita.split('/')[2]),
            "month": parseInt(row.tproxcita.split('/')[1]),
            "day": parseInt(row.tproxcita.split('/')[0])
          };
        }
      }
      if (row.tfechinicdescprenata != null) {
        if(row.tfechinicdescprenata.split('/').length == 3){
          tfechinicdescprenata = {
            "year": parseInt(row.tfechinicdescprenata.split('/')[2]),
            "month": parseInt(row.tfechinicdescprenata.split('/')[1]),
            "day": parseInt(row.tfechinicdescprenata.split('/')[0])
          };
        }
      }

    }
    const modalRef = this.modalService.open(AgregarGestanteModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = tipo;
    modalRef.componentInstance.data = { 
                                        tnumecontrol: tnumecontrol,
                                        tfechcapt: tfechcapt,
                                        tfur: tfur,
                                        tfpp: tfpp,
                                        tformobst: tformobst,
                                        tsemagest: tsemagest,
                                        tpeso: tpeso,
                                        tpresarte: tpresarte,
                                        tpulso: tpulso,
                                        tconthosp: tconthosp,
                                        ttelecont: ttelecont,
                                        ttelefami: ttelefami,
                                        totros: totros,
                                        triescovi: triescovi,
                                        tcontcovi: tcontcovi,
                                        triesocup: triesocup,
                                        tturntrab: tturntrab,
                                        tanamnesis: tanamnesis,
                                        tindica: tindica,
                                        ttemperatura: ttemperatura,
                                        tau: tau,
                                        tlcf: tlcf,
                                        tmovifeta: tmovifeta,
                                        tsitu: tsitu,
                                        tpres: tpres,
                                        tposi: tposi,
                                        tedemmmi: tedemmmi,
                                        tobse: tobse,
                                        tsato: tsato,
                                        tproxcita: tproxcita,
                                        tfechinicdescprenata: tfechinicdescprenata,
                                        usuarioSolicitar: this.usuarioSolicitar
                                      }
    modalRef.result.then((result) => {
      console.log(result)
      let objeInse = null;

      objeInse = {
        tcodigestante: row == null ? null : row.tcodigestante,
        tcodipers: this.usuarioSolicitar.tcodipers,
        tnumecontrol: result.tnumecontrol,
        tfechcapt: result.tfechcapt == null ? null : result.tfechcapt.day + '/' + result.tfechcapt.month + '/' + result.tfechcapt.year,
        tfur: result.tfur == null ? null : result.tfur.day + '/' + result.tfur.month + '/' + result.tfur.year,
        tfpp: result.tfpp == null ? null : result.tfpp.day + '/' + result.tfpp.month + '/' + result.tfpp.year,
        tformobst: result.tformobst,
        tsemagest: result.tsemagest,
        tpeso: result.tpeso,
        tpresarte: result.tpresarte,
        tpulso: result.tpulso,
        tconthosp: result.tconthosp,
        ttelecont: result.ttelecont,
        ttelefami: result.ttelefami,
        totros: result.totros,
        triescovi: result.triescovi,
        tcontcovi: result.tcontcovi,
        triesocup: result.triesocup,
        tturntrab: result.tturntrab,
        tanamnesis: result.tanamnesis,
        tindica: result.tindica,
        ttemperatura: result.ttemperatura,
        tau: result.tau,
        tlcf: result.tlcf,
        tmovifeta: result.tmovifeta,
        tsitu: result.tsitu,
        tpres: result.tpres,
        tposi: result.tposi,
        tedemmmi: result.tedemmmi,
        tobse: result.tobse,
        tsato: result.tsato,
        tproxcita: result.tproxcita == null ? null : result.tproxcita.day + '/' + result.tproxcita.month + '/' + result.tproxcita.year,
        tfechinicdescprenata: result.tfechinicdescprenata == null ? null : result.tfechinicdescprenata.day + '/' + result.tfechinicdescprenata.month + '/' + result.tfechinicdescprenata.year,
        tcodipersregi: this.sesion.tcodipers
      }
      console.log(objeInse)
      if (tipo == 0) {
        this.metoRegistro(objeInse);
      } else {
        this.metoActualizar(objeInse);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  metoRegistro(objeinsert: any) {
    let path = INSERT_GESTANTE;
    forkJoin({
      response: this.solicitarService.agregar(path,objeinsert)
    }).subscribe({
      next: ({ response }) => {
        let respuesta:any = null;
        respuesta = response;
        if(respuesta.httpcode == 200) {
          this.listGestante(this.usuarioSolicitar.tcodipers);
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
    let path = UPDATE_GESTANTE;
    forkJoin({
      response: this.solicitarService.actualizar(path,objeinsert)
    }).subscribe({
      next: ({ response }) => {
        let respuesta:any = null;
        respuesta = response;
        if(respuesta.httpcode == 200) {
          this.listGestante(this.usuarioSolicitar.tcodipers);
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

  modalEliminarGestante(user: any){
    const modalRef = this.modalService.open(CancelarModalComponent);
    modalRef.componentInstance.titulo = 'la vacuna'; // should be the id
    modalRef.componentInstance.data = { motivo: 'el motivo es' }; // should be the data

    modalRef.result.then((result) => {
      let objRechazar = {
        tcodigestante: user.tcodigestante
      }
      console.log(objRechazar);
      let path = DELETE_GESTANTE;
      this.solicitarService.eliminar(path,objRechazar).subscribe(
        resp => {
          let respuesta:any = null;
          respuesta = resp;
          if(respuesta.httpcode == 200) {
            this.listGestante(this.usuarioSolicitar.tcodipers);
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
        error => {
          //console.log("Error: " + error.message)
          Swal.fire(
            'Error',
            'error al eliminar:'+ error.message,
            'error'
          );
        }
      );
    }).catch((error) => {
      console.log(error);
    });
  }

}

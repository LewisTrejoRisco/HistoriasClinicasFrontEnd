import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/shared/auth/auth.service';
import { SolicitarService } from 'app/shared/services/solicitar.service';
import { REPORTACCIDENTE, REPORTEMOOBSERVADA, REPORTEMOXVENCER } from 'app/shared/utilitarios/Constantes';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { ReportAdapter } from 'app/shared/utilitarios/ReportAdapter.class';
import { ReportAdapterEMOObservada } from 'app/shared/utilitarios/ReportAdapterEMOObservada.class';
import { ReportAdapterAccidente } from 'app/shared/utilitarios/ReportAdapterAccidente.class';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss', '../../../assets/sass/libs/datatables.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [SolicitarService]
})
export class ReporteComponent implements OnInit {

  sesion: any;
  // PERSONA A BUSCAR
  usuarioSolicitar: any = null;
  listPersona: any = [];
  codigoTrabajador: string = null;
  // EMO
  d1: any;
  d2: any;
  transaccion: any;
  // ACCIDENTE LABORALES
  tranaaci: any;
  d3: any;
  d4: any;

  constructor(private modalService: NgbModal, 
    private solicitarService: SolicitarService,
    private authService: AuthService,
    private modal: NgbModal) { }

  ngOnInit(): void {
    this.sesion = JSON.parse(this.authService.userSesion);
    console.log(this.sesion)
    this.createFormEMO();
    this.createFormAcci();
  }

  modalDataRese: {
    titulo: string,
    action: string;
    transaccion: any
  };

  handleTransaccion(titulo: string, action: string, transaccion: any): void {
    this.modalDataRese = { titulo, action, transaccion};
  }

  createFormEMO() {
    this.transaccion = {
      tfechinic: null,
      tfechfin: null
    }
    this.handleTransaccion('Reporte', 'Reporte', this.transaccion);
  }

  modalDataRepo: {
    titulo: string,
    action: string;
    tranaaci: any
  };

  handleTranRepo(titulo: string, action: string, tranaaci: any): void {
    this.modalDataRepo = { titulo, action, tranaaci};
  }

  createFormAcci() {
    this.tranaaci = {
      tfechinic: null,
      tfechfin: null
    }
    this.handleTranRepo('Reporte', 'Reporte', this.tranaaci);
  }

  reportEMO(form: NgForm): void {
    let path = REPORTEMOXVENCER;
    forkJoin({
      response: this.solicitarService.listarfindall(path)
    }).subscribe({
      next: ({ response }) => {
        let respuesta:any = null;
        respuesta = response;
        const headers = ['ID', 'Codigo colaborador', 'Nombre Colaborador', 'Ubicación', 'Fecha inicio', 'Aptitud', 'Cantida programado anual', '# Veces tomada anual', 'Fecha vencimiento'];
        const report = new ReportAdapter(respuesta);
        this.solicitarService.generateReportWithAdapter2(headers,report.data, 'Reporte_emoxvencer.xlsx');
          Swal.fire({
            title: 'Exito',
            text: respuesta.message,
            icon: 'success',
            timer: 1000, 
            showConfirmButton: false,
          })
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

  reportEMOObservada(form: NgForm): void {
    let path = REPORTEMOOBSERVADA;
    forkJoin({
      response: this.solicitarService.listarfindall(path)
    }).subscribe({
      next: ({ response }) => {
        let respuesta:any = null;
        respuesta = response;
        const headers = ['ID', 'Codigo colaborador', 'Nombre Colaborador', 'Ubicación', 'Fecha inicio','Cantidad', 'Aptitud', 'Status', 'Detalle', 'Fecha Limite'];
        const report = new ReportAdapterEMOObservada(respuesta);
        this.solicitarService.generateReportWithAdapter(headers,report.data, 'Reporte_emoxobservada.xlsx');
          Swal.fire({
            title: 'Exito',
            text: respuesta.message,
            icon: 'success',
            timer: 1000, 
            showConfirmButton: false,
          })
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

  reportAccidentes(form: NgForm): void {
    let tfechinic = null;
    let tfechfin = null;
    if(this.modalDataRepo.tranaaci.tfechinic != null){
      tfechinic = this.modalDataRepo.tranaaci.tfechinic.day + '/' + this.modalDataRepo.tranaaci.tfechinic.month + '/' + this.modalDataRepo.tranaaci.tfechinic.year;
    }
    if(this.modalDataRepo.tranaaci.tfechfin != null){
      tfechfin = this.modalDataRepo.tranaaci.tfechfin.day + '/' + this.modalDataRepo.tranaaci.tfechfin.month + '/' + this.modalDataRepo.tranaaci.tfechfin.year;
    }
    console.log(this.modalDataRepo.tranaaci)
    let path = REPORTACCIDENTE;
    let param = '?tfechinic='+tfechinic+'&tfechfin='+tfechfin;
    if (tfechinic != null && tfechfin != null) {
      forkJoin({
        response: this.solicitarService.listar(path, param)
      }).subscribe({
        next: ({ response }) => {
          let respuesta:any = null;
          respuesta = response;
          const headers = ['ID', 'Fecha Accidente', 'Codigo Persona', 'Diagnostico', 'Clasificación', 'Referencia', 'Descanso Médico', 'Restricción', 'Indicaciones', 'Observaciones', 'Unidad Funcional'];
          const report = new ReportAdapterAccidente(respuesta);
          this.solicitarService.generateReporMovitWithAdapter(headers,report.data, 'Reporte_accidente.xlsx');
            Swal.fire({
              title: 'Exito',
              text: respuesta.message,
              icon: 'success',
              timer: 1000, 
              showConfirmButton: false,
            })
        },
        error: error => {
          Swal.fire(
            'Error',
            'Error al registrar: ' + error.message,
            'error'
          );
        }
      });
    } else {
      Swal.fire(
        'Error',
        'Se debe llenar la fecha inicio y fin',
        'error'
      );
    }
  }

}
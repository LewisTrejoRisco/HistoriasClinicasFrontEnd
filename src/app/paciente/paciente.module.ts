import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FichaComponent } from './ficha/ficha.component';
import { PacienteRoutingModule } from './paciente-routing.module';
import { AgregarAntepatoModalComponent } from './ficha/agregar-antepato/agregar-antepato-modal.component';
import { AgregarAcciLaboModalComponent } from './ficha/agregar-accilabo/agregar-accilabo-modal.component';
import { AgregarAnteOcupModalComponent } from './ficha/agregar-anteocup/agregar-anteocup-modal.component';
import { AgregarVacunaModalComponent } from './ficha/agregar-vacuna/agregar-vacuna-modal.component';
import { AgregarAnteOcupAptitudModalComponent } from './ficha/agregar-anteocup-aptitud/agregar-anteocup-aptitud-modal.component';
import { ModalAgregarVacunaModalComponent } from './ficha/modal-agregar-vacuna/modal-agregar-vacuna-modal.component';
import { CancelarModalComponent } from './cancelarModal/cancelar-modal.component';
import { AtencionMedicaComponent } from './atencion-medica/atencion-medica.component';
import { ReporteComponent } from './reporte/reporte.component';
import { AgregarGestanteModalComponent } from './ficha/agregar-gestante/agregar-gestante-modal.component';


@NgModule({
  declarations: [
    FichaComponent,
    AgregarAntepatoModalComponent,
    AgregarAcciLaboModalComponent,
    AgregarAnteOcupModalComponent,
    AgregarAnteOcupAptitudModalComponent,
    AgregarVacunaModalComponent,
    ModalAgregarVacunaModalComponent,
    CancelarModalComponent,
    AtencionMedicaComponent,
    ReporteComponent,
    AgregarGestanteModalComponent
          ],
  imports: [
    CommonModule,
    PacienteRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    PipeModule,
    NgbModule,
    NgSelectModule,
    FormsModule
  ]
})
export class PacienteModule { }

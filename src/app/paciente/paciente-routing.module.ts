import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FichaComponent } from './ficha/ficha.component';
import { AtencionMedicaComponent } from './atencion-medica/atencion-medica.component';
import { ReporteComponent } from './reporte/reporte.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ficha',
        component: FichaComponent,
        data: {
          title: 'Expediente'
        }
      },
      {
        path: 'atencionmedica',
        component: AtencionMedicaComponent,
        data: {
          title: 'Atención Médica'
        }
      },
      {
        path: 'reporte',
        component: ReporteComponent,
        data: {
          title: 'Reportes'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }

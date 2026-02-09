import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditoriaComponent } from './auditoria/auditoria.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'usuarios',
        component: AuditoriaComponent,
        data: {
          title: 'Usuarios'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

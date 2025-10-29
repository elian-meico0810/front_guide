import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/seguridad/seguridad-routing.module').then((m) => m.SeguridadRoutingModule)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard-routing.module').then((m) => m.DashboardRoutingModule)
  },

  {
    path: 'seguridad',
    loadChildren: () =>
      import('./modules/seguridad/seguridad-routing.module').then((m) => m.SeguridadRoutingModule)
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

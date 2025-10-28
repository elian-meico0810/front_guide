import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'acceso-denegado',
    component: AccessDeniedComponent
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../dashboard/dashboard-routing.module').then((m) => m.DashboardRoutingModule)
  },

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }

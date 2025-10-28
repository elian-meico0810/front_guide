import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MsalGuard } from '@azure/msal-angular';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { requiredPermission: '0001' }
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { requiredPermission: '0001' }
    }
]

@NgModule({
    declarations: [],
    imports: [
        CommonModule, RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }

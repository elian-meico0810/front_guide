import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { GuiasComponent } from '../guias/guias.component';
import { DetalleGuiasComponent } from './pages/detalle-guias/detalle-guias.component';

const routes: Routes = [
    {
        path: 'guias',
        component: GuiasComponent,
        canActivate: [AuthGuard],
        data: { requiredPermission: '0001' }
    },
    {
        path: 'detalle/:id',
        component: DetalleGuiasComponent,
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
export class GuiasRoutingModule { }

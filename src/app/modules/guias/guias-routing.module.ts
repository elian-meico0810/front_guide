import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { GuiasComponent } from '../guias/guias.component';

const routes: Routes = [
    {
        path: '',
        component: GuiasComponent,
        canActivate: [AuthGuard],
        data: { requiredPermission: '0001' }
    },
    /*{
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [AuthGuard],
        data: { requiredPermission: '0001' },
        children: [
            {
                path: 'crear',
                component: CrearUsuarioComponent,
                canActivate: [AuthGuard],
                data: { requiredPermission: '0002' }
            },
            {
                path: 'editar/:id',
                component: EditarUsuarioComponent,
                canActivate: [AuthGuard],
                data: { requiredPermission: '0004' }
            }
        ]
    },*/
    {
        path: 'guias',
        component: GuiasComponent,
        canActivate: [AuthGuard],
        data: { requiredPermission: '0001' },
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

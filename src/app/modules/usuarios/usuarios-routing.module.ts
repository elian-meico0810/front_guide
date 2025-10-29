import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { UsuariosComponent } from './usuarios.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';

const routes: Routes = [
    {
        path: '',
        component: UsuariosComponent,
        canActivate: [AuthGuard],
        data: { requiredPermission: '0001' }
    },
    {
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
    }
]

@NgModule({
    declarations: [],
    imports: [
        CommonModule, RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class UsuariosRoutingModule { }

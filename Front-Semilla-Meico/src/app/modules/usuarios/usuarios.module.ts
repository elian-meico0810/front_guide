import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from "../../core/core.module";
import { FormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { MatFormField } from '@angular/material/select';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [UsuariosComponent, CrearUsuarioComponent, DetalleUsuarioComponent, EditarUsuarioComponent],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    MatSelect,
    SharedModule,
    MatOption,
    FormsModule,
    MatFormField
],
  exports: [
    UsuariosComponent
  ],
})
export class UsuariosModule { }

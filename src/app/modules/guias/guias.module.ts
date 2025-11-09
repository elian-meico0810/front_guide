import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuiasRoutingModule } from './guias-routing.module';
import { GuiasComponent } from './guias.component';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/core/material.module';
import { SharedModule } from '@shared/shared.module';
import { DetalleGuiasComponent } from './pages/detalle-guias/detalle-guias.component';
import { ConsignacionesComponent } from './pages/consignaciones/consignaciones.component';

@NgModule({
  declarations: [
    GuiasComponent,
    DetalleGuiasComponent,
    ConsignacionesComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    GuiasRoutingModule,
    CoreModule,
    MaterialModule,
    SharedModule
  ]
})
export class GuiasModule { }

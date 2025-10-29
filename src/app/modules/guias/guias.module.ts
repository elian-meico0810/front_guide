import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { GuiasRoutingModule } from './guias-routing.module'; 
import { GuiasComponent } from './guias.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    GuiasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,         
    GuiasRoutingModule
  ]
})
export class GuiasModule { }

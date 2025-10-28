import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CoreModule } from "../../core/core.module";
import { SharedModule } from "../../shared/shared.module";
import { LoginComponent } from './pages/login/login.component';
import { SeguridadRoutingModule } from "./seguridad-routing.module";
import { SeguridadComponent } from './seguridad.component';

@NgModule({
  declarations: [
    LoginComponent,
    SeguridadComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    SeguridadRoutingModule
  ],
  exports: []
})
export class SeguridadModule { }

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

import { HttpClientModule, provideHttpClient, withInterceptors } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MsalModule, MsalRedirectComponent } from "@azure/msal-angular";
import { NgxSpinnerModule } from "ngx-spinner";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MsalGuardConfig, MsalInstance, MsalInterceptorConfig } from "./app.config";
import { CoreModule } from "./core/core.module";
import { httpRequestAuthorizationInterceptor } from "./core/interceptors/http-request-authorization.interceptor";
import { httpRequestHandlerErrorsInterceptor } from "./core/interceptors/http-request-handler-api-errors.interceptor";
import { httpRequestLoadingInterceptor } from "./core/interceptors/http-request-loading.interceptor";
import { SeguridadModule } from "./modules/seguridad/seguridad.module";
import { SharedModule } from "./shared/shared.module";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";
import { FormsModule } from '@angular/forms';
import { UsuariosModule } from "./modules/usuarios/usuarios.module";


@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SeguridadModule,
    CoreModule,
    HttpClientModule,
    SharedModule,
    UsuariosModule,
    BrowserAnimationsModule,
    FormsModule  ,
    NgxSpinnerModule.forRoot({ type: 'ball-fussion' }),
    MsalModule.forRoot(
      MsalInstance(),
      MsalGuardConfig(),
      MsalInterceptorConfig()
    )
  ],
  providers: [
    provideHttpClient(
      withInterceptors([
        httpRequestAuthorizationInterceptor,
        httpRequestLoadingInterceptor,
        httpRequestHandlerErrorsInterceptor
      ])
    )
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

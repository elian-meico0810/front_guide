import { Component, Input, OnInit } from '@angular/core';
import { CardService } from './services/card.service';
import { card } from './model/card.model';
import { LoginService } from 'src/app/modules/seguridad/pages/login/services/login-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay, forkJoin } from 'rxjs';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  tarjetasAplicacionesViejas: card[] = [];
  tarjetasAplicacionesNuevas: card[] = [];
  // tarjetasNuevas: card[] = [];
  // tarjetasIntranet: card[] = [];
  tarjetasNuevasFiltradas: card[] = [];
  tarjetasIntranetFiltradas: card[] = [];
  // token: string =  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyJ9.eyJhdWQiOiJhOTFjOWQyZi1hMGUwLTQ3OGItYTI2NS00YTFkYTNkNDQxYTMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vYTA2ZDJjOTItNzgwMy00MTdmLTk4MTItMTZhZjYwMGZlZTQ3L3YyLjAiLCJpYXQiOjE3Mzg3OTA4NDUsIm5iZiI6MTczODc5MDg0NSwiZXhwIjoxNzM4Nzk0NzQ1LCJhaW8iOiJBV1FBbS84WkFBQUFBTnE4K1l6TUpYM2ozVFZBamlZT3BXZFNJQmRSS3B3ZGc5UCs0OFNLT3ZLWmN6OS9SMHkwTTcxRHUwVFZlTkN0UWFIUFpiKy9sSWZzc3YrOUx4bTBDZUlpaUlnR2pTaURjV2RLU0kyVnFFa01KMU9MZkFVd09GWjlXdDFNd2daSyIsIm5hbWUiOiJFc3RlZmFueSBCYXJyaW9zIiwibm9uY2UiOiIwMTk0ZDgwNi1lYjdhLTcyOGEtYWQ2Yi1lMDcyN2MxNTg5OTEiLCJvaWQiOiIwYTIxMmJlMi02YjEzLTQxMDEtODkwNS03YTk2MjFhNzRjYzIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJlYmFycmlvc0BtZWljby5jb20uY28iLCJyaCI6IjEuQVNVQWtpeHRvQU40ZjBHWUVoYXZZQV91UnktZEhLbmdvSXRIb21WS0hhUFVRYVB0QURjbEFBLiIsInNpZCI6IjAwMWY0ZmI5LTNmNTMtODhmZC1hN2RjLWIxMDM0OGIzMDk3ZCIsInN1YiI6Ik1fQUZrTWFJS1RIYVktRk5oQzIxdHVhTEtBUFdGQlJiYzdoc3hZN2hUUlUiLCJ0aWQiOiJhMDZkMmM5Mi03ODAzLTQxN2YtOTgxMi0xNmFmNjAwZmVlNDciLCJ1dGkiOiJNcF81RTktSnAwT1N6dHBwVnRWQ0FBIiwidmVyIjoiMi4wIn0.PUJjpM7EQPXDcLZpEwbsl-kl_ICyZ6YykWH4l67WllPEhHV9yovD2qyvAvoAQToPbfrtsmRjNS2BNlD2QPTVKi81_McXpkiPbhINGUZDcikSo9sVm_lEBAAJ1iOQVM786wcqdbBts3GgiEe3_TcQ_Rvg7vi3N7QAGCdcYmpRHD2jXUxti4cWTEVUgrtaKGcvTO8GrRSgHt26tH9j_VUIuGySwuuywoxh0ZxfrtWqK0FdPPIVBzw2oj6lWyFqzNno1UAsa9dm0BDWwkiMLuHJy-5NXYHxkCrO-nJAOzbxihlIgoVaGqGPWQscmb45Io8NbzFVO90RYAOOLzsxHgIH1g';

  constructor(
    private cardService: CardService,
    private logintoken: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,

  ) {
    this.tarjetasNuevasFiltradas = [...this.tarjetasAplicacionesNuevas];
    this.tarjetasIntranetFiltradas = [...this.tarjetasAplicacionesViejas];
  }

  token: string = "";
  async ngOnInit(): Promise<void> {
    await this.CargarTarjetas();
  }

  // combinarTarjetas() {
  //   this.tarjetasCombinadas = this.tarjetasAplicacionesViejas.concat(this.tarjetasAplicacionesNuevas);
  //   this.tarjetasNuevas = this.tarjetasCombinadas.filter(t => t.Origen === 'Apps2');
  //   this.tarjetasIntranet = this.tarjetasCombinadas.filter(t => t.Origen === 'Intranet');
  // }
  onSearchChange(searchText: string): void {
    console.log(searchText);
    if (!searchText) {
      // Si el input está vacío, restauramos la lista completa de tarjetas
      this.tarjetasNuevasFiltradas = [...this.tarjetasAplicacionesNuevas];
      this.tarjetasIntranetFiltradas = [...this.tarjetasAplicacionesViejas];
      return; // Salimos de la función para no hacer el filtro
    }

    // Si hay texto, filtramos las tarjetas
    const texto = searchText.toLowerCase();
    this.tarjetasNuevasFiltradas = this.tarjetasAplicacionesNuevas.filter(tarjeta =>
      tarjeta.Nombre.toLowerCase().includes(texto)
    );
    this.tarjetasIntranetFiltradas = this.tarjetasAplicacionesViejas.filter(tarjeta =>
      tarjeta.Nombre.toLowerCase().includes(texto)
    );

  }
   // if (!searchText) {
    //   this.combinarTarjetas();  // Vuelve a combinar las tarjetas
    // } else {
    //   // Filtra las tarjetas combinadas según el texto de búsqueda

    //   this.tarjetasCombinadas = this.tarjetasCombinadas.filter(t =>
    //     t.Nombre.toLowerCase().includes(searchText.toLowerCase())

    //   );
    //   console.log(this.tarjetasCombinadas);
    // }


    async CargarTarjetas(){
      this.token = this.logintoken.GetToken();
      this.cardService.obtenerTarjetasAppviejas(this.token).subscribe({
        next: (response) => {
          this.tarjetasAplicacionesViejas = response.data;
          this.tarjetasIntranetFiltradas = [...this.tarjetasAplicacionesViejas];
          //console.log(response.statusCode);
          // this.combinarTarjetas();
          console.log(response.data);
        },
        error: (err) => {
          // console.warn("Token expirado, cerrando sesión y redirigiendo...");
          //console.warn(err.statusCode)
          if (err.data === 401) {
            this.logintoken.AutenticacionMicrosoft();
            // this.logintoken.isAutenticated()
            // this.logintoken.logout();
            // this.router.navigate(['/login']);
          }
        }
      });

       // Obtener las tarjetas nuevas
    this.cardService.obtenerTarjetasAppNuevas(this.token).subscribe({
      next: (response) => {
        this.tarjetasAplicacionesNuevas = response.data;
        this.tarjetasNuevasFiltradas = [...this.tarjetasAplicacionesNuevas];
        // this.combinarTarjetas();
      },
      error: (err) => {
        console.warn("Token expirado, cerrando sesión y redirigiendo...");
        console.log(err.status)
        if (err.statusCode === 401) {
          this.logintoken.AutenticacionMicrosoft();
          // this.logintoken.isAutenticated()
          // this.logintoken.logout();
          // this.router.navigate(['/login']);
        }
      }
    });
    }

}

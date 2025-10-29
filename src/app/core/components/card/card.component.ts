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

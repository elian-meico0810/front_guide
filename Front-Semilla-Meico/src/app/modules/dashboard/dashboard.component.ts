import { Component, OnInit } from '@angular/core';
import { CardService } from '@core/components/card/services/card.service';
import { environment } from 'src/environments/enviroments';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  cards: { Nombre: string; Descripcion: string }[] = [];
  userName: string = '';
  constructor(private cardService: CardService) {}
  ngOnInit(): void {
    this.userName = JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').Name || "";
    console.log("Nombre: " + localStorage.getItem('Name'));
    

    // this.cardService.getTarjetas().subscribe({
    //   next: (response) => {
    //     this.cards = response;
    //   },
    //   error: (err) => {
    //     console.error('Error al obtener tarjetas', err);
    //   }
    // });
  }
  

}

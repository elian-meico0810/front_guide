import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-guias',
  templateUrl: './guias.component.html',
  styleUrls: ['./guias.component.css'],
})
export class GuiasComponent {
  filter: string = '';
  returnDate: string = new Date().toISOString().split('T')[0]; // fecha actual en formato YYYY-MM-DD

  constructor(
    private router: Router,
    private dialog: MatDialog,
    // private consolidadoService: ConsolidadoService
  ) {}

  filterGuide() {
    console.log('Filtrando por:', this.filter);
  }

  addGuide() {
    console.log('Abrir formulario para agregar una nueva guía');
    //const dialogRef = this.dialog.open(NuevaGuiaComponent, {
    //  width: '600px',
    //  disableClose: true,
    //});

    //dialogRef.afterClosed().subscribe((result) => {
    //  if (result) {
    //    console.log('Nueva guía agregada:', result);
    //   
    //  }
    //});
  }

  /** 📦 Enviar consolidado */
  sendConsolidated() {
    console.log('Enviando consolidado...');
    //// Si tienes un servicio que gestiona consolidaciones
    //this.consolidadoService.enviarConsolidado().subscribe({
    //  next: (resp) => {
    //    console.log('Consolidado enviado:', resp);
    //    alert('✅ Consolidado enviado correctamente');
    //  },
    //  error: (err) => {
    //    console.error('Error al enviar consolidado', err);
    //    alert('❌ Ocurrió un error al enviar el consolidado');
    //  },
    //});
  }
}

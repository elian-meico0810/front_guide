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
  totalizers = {
    dispatched: 1000,
    confirmed: 10,
    expected: 25000000,
    collected: 19850000
  };

  constructor(
    private router: Router,
    private dialog: MatDialog,
    // private consolidadoService: ConsolidadoService
  ) { }

  columns = [
    { key: 'fechaCreacion', label: 'Fecha creación' },
    { key: 'numeroGuia', label: 'N° Guía' },
    { key: 'facturas', label: 'Facturas' },
    { key: 'transportador', label: 'Transportador' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaRetorno', label: 'Fecha retorno' },
    { key: 'valorRecaudar', label: 'Valor a recaudar' }
  ];

  guides = [
    {
      fechaCreacion: '2025-10-28',
      numeroGuia: '000005',
      facturas: 6,
      transportador: 'Jorge Maury',
      estado: 'Despachada',
      fechaRetorno: '2025-10-28',
      valorRecaudar: '$4,300,000'
    }
  ];

  filterGuide() {
    console.log('Filtrando por:', this.filter);
  }

  loadTotalizers() {

  }

  addGuide() {
    console.log('Abrir formulario para agregar una nueva guía');
  }

  sendConsolidated() {
    console.log('Enviando consolidado...');

  }
}

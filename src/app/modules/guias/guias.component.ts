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
  returnDate: Date = new Date();
  allDates: string[] = [];

  ngOnInit() {
    this.generateAllDates(2025);
  }

  // Genera todas las fechas de un año en formato "MMMM d, yyyy"
  generateAllDates(year?: number) {
    const today = new Date();
    const currentYear = year ?? today.getFullYear();

    const start = new Date(currentYear, 0, 1); 
    const end = new Date(currentYear, 11, 31);
    const dates: string[] = [];

    let current = new Date(start);
    while (current <= end) {
      const formatted = current.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const parts = formatted.split(' ');
      const day = parts[0];
      const month = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
      const yearPart = parts[2];
      dates.push(`${month} ${day}, ${yearPart}`);

      current.setDate(current.getDate() + 1);
    }

    this.allDates = dates;

    const todayFormatted = today.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const parts = todayFormatted.split(' ');
    const day = parts[0];
    const month = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    const yearPart = parts[2];
    const todayString = `${month} ${day}, ${yearPart}`;

    this.returnDateString = this.allDates.includes(todayString)
      ? todayString
      : this.allDates[0];

    this.returnDate = today;
  }

  totalizers = {
    dispatched: 1000,
    confirmed: 10,
    expected: 25000000,
    collected: 19850000
  };
  returnDateString: string = '';

  onSelectChange(event: any) {
    this.returnDateString = event.target.value;
    this.returnDate = new Date(this.returnDateString);
  }

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

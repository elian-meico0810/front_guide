import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Environment } from '@core/config/environment';
import { ConsolidatedModalComponent } from '../../core/components/consolidated-modal/consolidated-modal.component';
import { AddGuideModalComponent } from '../../core/components/add-guide-modal/add-guide-modal.component';
import { ConsolidationSentComponent } from '../../core/components/consolidation-sent/consolidation-sent.component';

@Component({
  selector: 'app-guias',
  templateUrl: './guias.component.html',
  styleUrls: ['./guias.component.css'],
})
export class GuiasComponent implements OnInit {

  filter: string = '';
  returnDate: Date = new Date();
  allDates: string[] = [];
  returnDateString: string = '';
  guides: any[] = [];
  selectedGuias: any[] = [];

  // ✅ columnas para la tabla
  columns = [
    { key: 'correo', label: 'Correo' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'estado', label: 'Estado' },
  ];

  // Paginación
  totalItems = 0;
  currentPage = 1;
  perPage = 10;
  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;
  loading = false;

  private readonly API_URL = Environment.USERS;

  totalizers = {
    dispatched: 1000,
    confirmed: 10,
    expected: 25000000,
    collected: 19850000
  };

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.generateAllDates(2025);
    this.loadGuides();
  }

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

  onSelectChange(event: any) {
    this.returnDateString = event.target.value;
    this.returnDate = new Date(this.returnDateString);
  }

  loadGuides(page: number = 1) {
    this.loading = true;
    const params = { page: page.toString(), per_page: this.perPage.toString() };
    this.http.get<any>(this.API_URL, { params }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.guides = res.data.results;
          this.totalItems = res.data.count;
          this.nextPageUrl = res.data.next;
          this.prevPageUrl = res.data.previous;
          this.currentPage = page;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar las guías:', err);
        this.loading = false;
      }
    });
  }

  
  filterGuide() {
    // Opcional: si quieres filtrar las guías localmente sin llamar a la API
    if (!this.filter) {
      this.loadGuides(this.currentPage);
      return;
    }

    this.guides = this.guides.filter(g =>
      Object.values(g).some(value =>
        value?.toString().toLowerCase().includes(this.filter.toLowerCase())
      )
    );
  }
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.perPage);
  }

  changePage(page: number) {
    if (page < 1 || (this.totalItems && page > this.totalPages)) return;
    this.loadGuides(page);
  }

  addGuide() {
    const dialogRef = this.dialog.open(AddGuideModalComponent, {
      width: '540px',
      panelClass: 'custom-dialog',
      data: { defaultNumber: '000006' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.numeroGuia) {
        this.guides.unshift({
          fechaCreacion: new Date().toISOString().split('T')[0],
          numeroGuia: result.numeroGuia,
          facturas: 0,
          transportador: '',
          estado: 'pendiente',
          fechaRetorno: new Date().toISOString().split('T')[0],
          valorRecaudar: '$0',
          selected: false
        });
      }
    });
  }

  sendConsolidated() {
    this.selectedGuias = this.guides.filter(g => g.selected);
    const dialogRef = this.dialog.open(ConsolidatedModalComponent, {
      width: '500px',
      data: { guias: this.selectedGuias }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Consolidado confirmado:', result);
        this.dialog.open(ConsolidationSentComponent, {
          width: '520px',
          data: { dateLabel: this.returnDateString }
        });
      }
    });
  }

  toggleGuiaSelection(guia: any) {
    guia.selected = !guia.selected;
    this.selectedGuias = this.guides.filter(g => g.selected);
  }
}

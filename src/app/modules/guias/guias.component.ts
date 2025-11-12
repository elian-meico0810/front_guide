import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Environment } from '@core/config/environment';
import { ConsolidatedModalComponent } from '../../core/components/consolidated-modal/consolidated-modal.component';
import { AddGuideModalComponent } from '../../core/components/add-guide-modal/add-guide-modal.component';
import { ConsolidationSentComponent } from '../../core/components/consolidation-sent/consolidation-sent.component';
import { HttpBaseAppService } from '@core/services/http-base-app.service';
import { ObjParam } from '@core/interfaces/base/obj-param.interface';

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
  isOpen = false;
  originalData: any[] = [];

  // columnas para la tabla
  columns = [
    { key: 'fecha_creacion_guia', label: 'Fecha creación', type: 'date', filter: false },
    { key: 'numero_guia', label: 'N° Guía', filter: false },
    { key: 'cantidad_facturas', label: 'Facturas', type: 'number', filter: false },
    { key: 'estado_guia', label: 'Estado', filter: true, type: 'estado' },
    { key: 'transportador', label: 'Transportador', filter: true },
    { key: 'mayor_fecha_retorno', label: 'Fecha retorno', type: 'date', filter: false },
    { key: 'valor_recaudar', label: 'Valor recaudar', type: 'currency', filter: false },
  ];

  // Paginación
  totalItems = 0;
  currentPage = 1;
  perPage = 10;
  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;
  loading = false;

  totalizers = {
    dispatched: 0,
    confirmed: 0,
    expected: 0,
    collected: 0
  };

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private httpAppService: HttpBaseAppService,
  ) { }

  ngOnInit() {
    this.generateAllDates(2025);
    this.loadGuides();
    this.loadTotalizers();
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

  onSelectChange(date: string) {
    this.returnDateString = date;
    this.returnDate = new Date(date);
    this.isOpen = false;
  }


  loadGuides(page: number = 1, filters: any = {}) {
    this.loading = true;

    const params: ObjParam[] = [
      { campo: 'page', valor: page.toString() },
      { campo: 'page_size', valor: this.perPage.toString() },
    ];

    if (filters.search) {
      params.push({ campo: 'search', valor: filters.search });
    }

    this.httpAppService
      .get<any>(Environment.DETAILS_GUIDE, params).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.guides = res.data.results;
            this.originalData = [...res.data.results];
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

  loadTotalizers() {
    this.httpAppService.get<any>(Environment.TOTALS_STATIC_GUIDE, []).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.totalizers = {
            dispatched: res.data.total_despachada ?? 0,
            confirmed: res.data.total_confirmada ?? 0,
            expected: res.data.total_valor_esperado_recaudar ?? 0,
            collected: res.data.total_valor_recaudado ?? 0,
          };
        } else {
          this.resetTotalizers();
        }
      },
      error: (err) => {
        console.error('Error al cargar los totales:', err);
        this.resetTotalizers();
      }
    });
  }

  resetTotalizers() {
    this.totalizers = {
      dispatched: 0,
      confirmed: 0,
      expected: 0,
      collected: 0,
    };
  }

  goToDetail(guia: any) {
    this.router.navigate(['detalle', guia.numero_guia]);
  }


  filterGuide() {
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

  changePerPage(newSize: number) {
    this.perPage = newSize;
    this.loadGuides(1);
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


  onFilterColumn(event: { key: string; value: any }) {
    const { key, value } = event;

    if (value === null || value === undefined || value === '') {
      this.guides = [...this.originalData];
      return;
    }

    const filterValue = value.toString().toLowerCase(); 

    // Filtra los datos
    this.guides = this.originalData.filter((guia: any) => {
      const cellValue = guia[key];

      if (cellValue === null || cellValue === undefined) return false;

      const cellString = cellValue.toString();
      return cellString.toLowerCase().includes(filterValue);
    });
  }



}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Environment } from '@core/config/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddConsignacionModalComponent } from '@core/components/add-consignacion-modal/add-consignacion-modal.component';

@Component({
  selector: 'app-detalle-guias',
  templateUrl: './detalle-guias.component.html',
  styleUrls: ['./detalle-guias.component.css'],
})
export class DetalleGuiasComponent implements OnInit {

  numeroGuia!: string;
  guia: any = null;
  loading = true;
  filter: string = '';
  allDates: string[] = [];
  returnDateString: string = '';
  guides: any[] = [];
  selectedGuias: any[] = [];
  activeTab: 'detalle' | 'consignaciones' = 'detalle';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    
  ) { }

  // Paginación
  totalItems = 0;
  currentPage = 1;
  perPage = 10;
  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;

  // columnas para la tabla
  columns = [
    { key: 'fecha_creacion_guia', label: 'Fecha creación', type: 'date' },
    { key: 'numero_guia', label: 'N° Guía' },
    { key: 'cantidad_facturas', label: 'Facturas', type: 'number' },
    { key: 'estado_guia', label: 'Estado' },
    { key: 'fecha_retorno', label: 'Fecha retorno', type: 'date' },
    { key: 'valor_recaudar', label: 'Valor recaudar', type: 'currency' },
  ];


  private readonly API_URL = Environment.INFO_GUIAS;

  totalizers = {
    dispatched: 1000,
    confirmed: 10,
    expected: 25000000,
    collected: 19850000
  };

  ngOnInit() {
    // Datos de ejemplo (simular respuesta de API)
    this.guia = {
      cantidad_facturas: 4,
      transportador: 'Jorge Maury',
      estado: 'Despachada',
      bodega: 'BQ1',
      valor_a_recaudar: 6682112,
      diferencia: 15831.6,
      total_recaudado: 6666281,
      recaudado_consignacion: 300000,
      recaudado_qr: 208127,
      fecha_retorno: '2025-10-28'
    };

    this.generateAllDates(2025);
    this.loadGuides();
    this.numeroGuia = this.route.snapshot.paramMap.get('id') ?? '';
  }

  goBack() {
    this.router.navigate(['/guias']);
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

  }

  loadGuides(page: number = 1) {
    this.loading = true;
    const params = { page: page.toString(), page_size: this.perPage.toString() };
    this.http.get<any>('assets/mocks/guias.json').subscribe({
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


  goToDetail(guia: any) {
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

  addConsignacion() {
    const dialogRef = this.dialog.open(AddConsignacionModalComponent, {
      width: '540px',
      panelClass: 'custom-dialog',
      data: { numeroGuia:  this.numeroGuia }
    });
  }

  onFilterColumn(columnKey: string) {
  }

}

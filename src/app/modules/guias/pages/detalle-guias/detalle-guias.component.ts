import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Environment } from '@core/config/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddConsignacionModalComponent } from '@core/components/add-consignacion-modal/add-consignacion-modal.component';
import { HttpBaseAppService } from '@core/services/http-base-app.service';
import { ObjParam } from '@core/interfaces/base/obj-param.interface';

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
  originalData: any[] = [];
  filterTimeout: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    private httpAppService: HttpBaseAppService,

  ) { }

  // Paginación
  totalItems = 0;
  currentPage = 1;
  perPage = 10;
  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;

  // columnas para la tabla
  columns = [
    { key: 'NumeroDocumento', label: 'N° Factura' },
    { key: 'RazonSocialCliente', label: 'Cliente' },
    { key: 'ValorFactura', label: 'Valor Factura', type: 'currency' },
    { key: 'ValorNc', label: 'Valor NC Real', type: 'currency' },
    { key: 'DfrReal', label: 'DFR Real', type: 'currency' },
    { key: 'ValorEsperadoRecaudar', label: 'Valor a Recaudar', type: 'currency' },
    { key: 'Diferencia', label: 'Diferencia', type: 'currency' },
    { key: 'EstadoPlanilla', label: 'Estado', type: 'estado'},
  ];


  private readonly API_URL = Environment.INFO_GUIAS;

  ngOnInit() {
    // Datos de ejemplo (simular respuesta de API)
    this.numeroGuia = this.route.snapshot.paramMap.get('id') ?? '';
    this.generateAllDates(2025);
    this.loadComponentGuides()
    this.loadGuides();
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

  loadComponentGuides() {
    this.loading = true;
    const params: ObjParam[] = [];

    if (this.numeroGuia) {
      params.push({ campo: 'numeroGuia', valor: this.numeroGuia });

    }

    this.httpAppService.get<any>(Environment.GET_GUIDE_BY_NUMERO_GUIDE, params).subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.results.length > 0) {
          const guide = res.data.results[0];
          this.guia = {
            cantidad_facturas: guide.CantidadFacturas,
            transportador: guide.Transportador,
            estado: guide.EstadoGuia,
            bodega: 'BQ212',
            valor_a_recaudar: guide.ValorRecaudar || 0,
            diferencia: guide.ValorRecaudar|| 0,
            total_recaudado: guide.ValorRecaudar || 0,
            recaudado_consignacion: 0,
            recaudado_qr: 0,
            fecha_retorno: guide.MayorFechaRetorno.split('T')[0]
          };
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar las guías:', err);
        this.loading = false;
      }
    });
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
      .get<any>(Environment.GET_PLANILLA_DETALLE_FACTURAS, params).subscribe({
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
    clearTimeout(this.filterTimeout);

    this.filterTimeout = setTimeout(() => {
      const filters = {
        search: this.filter || ''
      };

      this.loadGuides(1, filters);

    }, 1500); // 1500 ms = 1.5 segundos
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
      data: { numeroGuia: this.numeroGuia }
    });
  }

  onFilterColumn(event: { key: string; value: any }) {
    const { key, value } = event;

    if (value === null || value === undefined || value === '') {
      this.guides = [...this.originalData];
      return;
    }

    const filterValue = value.toString().toLowerCase()

    this.guides = this.originalData.filter((guia: any) => {
      const cellValue = guia[key];

      if (cellValue === null || cellValue === undefined) return false;

      const cellString = cellValue.toString();
      return cellString.toLowerCase().includes(filterValue);
    });
  }

}

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
    { key: 'fecha_creacion_guia', label: 'Fecha creación', type: 'date' },
    { key: 'numero_guia', label: 'N° Guía' },
    { key: 'cantidad_facturas', label: 'Facturas', type: 'number' },
    { key: 'estado_guia', label: 'Estado' },
    { key: 'fecha_retorno', label: 'Fecha retorno', type: 'date' },
    { key: 'valor_recaudar', label: 'Valor recaudar', type: 'currency' },
  ];


  private readonly API_URL = Environment.INFO_GUIAS;

  ngOnInit() {
    // Datos de ejemplo (simular respuesta de API)
    this.numeroGuia = this.route.snapshot.paramMap.get('id') ?? '';
    this.generateAllDates(2025);
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

  loadGuides(page: number = 1) {
    this.loading = true;
    const params: ObjParam[] = [];

    if (this.numeroGuia) {
      params.push({ campo: 'numeroGuia', valor: this.numeroGuia });

    }
    
    this.httpAppService.get<any>(Environment.GET_GUIDE_BY_NUMERO_GUIDE, params).subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.results.length > 0) {
          const guide = res.data.results[0];
          console.log("res.data.results: ", res.data)
          this.guia = {
            cantidad_facturas: guide.cantidad_facturas,
            transportador: guide.transportador,
            estado: guide.estado_guia,
            bodega: 'BQ212',
            valor_a_recaudar: guide.valor_recaudar || 0,
            diferencia: guide.valor_recaudar - guide.valor_recaudar || 0,
            total_recaudado: guide.valor_recaudar || 0,
            recaudado_consignacion: 0,
            recaudado_qr: 0,
            fecha_retorno: guide.mayor_fecha_retorno.split('T')[0]
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

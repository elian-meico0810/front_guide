import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Environment } from '@core/config/environment';

@Component({
    selector: 'app-consignaciones',
    templateUrl: './consignaciones.component.html',
    styleUrls: ['./consignaciones.component.scss']
})
export class ConsignacionesComponent {
    @Input() numeroGuia!: string | number;

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
        private http: HttpClient
    ) { }

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

    // Paginación
    totalItems = 0;
    currentPage = 1;
    perPage = 10;
    nextPageUrl: string | null = null;
    prevPageUrl: string | null = null;

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

        this.loadGuides();
        this.numeroGuia = this.route.snapshot.paramMap.get('id') ?? '';
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
    }

    onFilterColumn(event: { key: string; value: any }) {
        const { key, value } = event;

        if (value === null || value === undefined || value === '') {
            this.loadGuides(this.currentPage);
            return;
        }

        const filterValue = String(value).toLowerCase();

        this.guides = this.guides.filter(guia => {
            const cellValue = guia[key];

            if (cellValue === null || cellValue === undefined) return false;

            const cellString = String(cellValue);

            return cellString.toLowerCase().includes(filterValue);
        });
    }



    OnDelete(item: any) {
        this.guides = this.guides.filter(g => g !== item);
        this.totalItems = this.guides.length;
    }

    goToDetail(item: any) {
        this.router.navigate(['/detalle-guia', item.numero_guia]);
    }


}

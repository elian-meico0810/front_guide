import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbEnums } from '@core/config/db';
import { Environment } from '@core/config/environment';
import { ObjParam } from '@core/interfaces/base/obj-param.interface';
import { HttpBaseAppService } from '@core/services/http-base-app.service';
import { HttpBaseService } from '@core/services/http-base.service';

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
    originalData: any[] = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        private httpAppService: HttpBaseAppService,
    ) { }

    // columnas para la tabla
    columns = [
        { key: 'fecha_consignacion_corta', label: 'Fecha', type: 'date' },
        { key: 'valor_consignacion', label: 'Valor consignación', type: 'currency' },
        { key: 'tipo_consignacion', label: 'Tipo' },
        { key: 'nombre_archivo', label: 'Soporte', type: 'soporte' },
    ];

    filteredData = [
        {
            nombre_archivo: 'nombre_archivo',
            ruta_archivo_soporte: 'ruta_archivo_soporte',
            sas_token: DbEnums.TOKEN_AZURE
        },
    ];
    
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

        // Definir parámetros
        const params: ObjParam[] = [
            { campo: 'page', valor: page.toString() },
            { campo: 'page_size', valor: this.perPage.toString() },
        ];

        // Llamada al backend con el servicio base
        this.httpAppService
            .get<any>(Environment.GET_ALL_CONSIGNACIONES, params)
            .subscribe({
                next: (res) => {

                   if (res.data?.results) {
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
                    console.error('Error al cargar consignaciones:', err);
                    this.loading = false;
                },
            });
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

import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationModalComponent } from '@core/components/confirmation-modal/confirmation-modal.component';
import { DbEnums } from '@core/config/db';
import { Environment } from '@core/config/environment';
import { ObjParam } from '@core/interfaces/base/obj-param.interface';
import { HttpBaseAppService } from '@core/services/http-base-app.service';

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
    groupFilters: any[] = [];
    activeFilters: any[] = [];


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        private httpAppService: HttpBaseAppService,
        private dialog: MatDialog
    ) { }

    // columnas para la tabla
    columns = [
        { key: 'fecha_consignacion_corta', label: 'Fecha', type: 'date', filter: false },
        { key: 'valor_consignacion', label: 'Valor consignación', type: 'currency', filter: false },
        { key: 'tipo_consignacion', label: 'Tipo', filter: false },
        { key: 'nombre_archivo', label: 'Soporte', type: 'soporte', filter: true },
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
        this.loadGroupGuides();
        this.loadGuides();
        this.numeroGuia = this.route.snapshot.paramMap.get('id') ?? '';
    }

    loadGroupGuides() {
        this.loading = true;
        this.httpAppService
            .get<any>(Environment.GET_GROUP_PARAMETROS, [])
            .subscribe({
                next: (res) => {
                    if (res.data) {
                        this.groupFilters = res.data;
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error al cargar parámetros:', err);
                    this.loading = false;
                },
            });
    }

    // Cargar registros paginados
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
            .get<any>(Environment.GET_ALL_CONSIGNACIONES, params)
            .subscribe({
                next: (res) => {
                    if (res.data?.results) {
                        this.guides = res.data.results;
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

    onFilterColumn(event: { key: string; value: string }) {
        const { key, value } = event;

        // Guardar los filtros activos
        this.activeFilters = { ...this.activeFilters, [key]: value };

        const searchValue = Object.values(this.activeFilters)
            .filter(v => v && v.trim() !== '')
            .join(' ');

        this.loadGuides(1, { search: searchValue });
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



    OnDelete(item: any) {
        const dialogRef = this.dialog.open(ConfirmationModalComponent, {
            data: {
                mensaje: `¿Deseas eliminar el registro "${item.nombre_archivo}"?`,
                submensaje: 'Esta acción no se puede deshacer.',
                textoBotonAceptar: 'Sí, eliminar',
                textoBotonCancelar: 'Cancelar',
                success: false
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.httpAppService.deleteMethod(`${Environment.DELETE_CONSIGNACIONES}/?id=${item.id}`).subscribe({
                    next: (res: any) => {
                        this.dialog.open(ConfirmationModalComponent, {
                            data: {
                                mensaje: res?.success
                                    ? 'El registro fue eliminado correctamente.'
                                    : res?.messages || 'No se pudo eliminar el registro.',
                                textoBotonAceptar: 'Cerrar',
                                success: res?.success ?? true
                            }
                        });

                        if (res?.success) {
                            this.loadGuides(this.currentPage, this.activeFilters);
                        }
                    },
                    error: (err) => {
                        console.error('Error al eliminar:', err);
                        this.dialog.open(ConfirmationModalComponent, {
                            data: {
                                mensaje: 'Ocurrió un error al eliminar el registro.',
                                textoBotonAceptar: 'Cerrar',
                                success: false
                            }
                        });
                    }
                });
            }
        });
    }

    goToDetail(item: any) {
        this.router.navigate(['/detalle-guia', item.numero_guia]);
    }


}

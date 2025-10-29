import { ChangeDetectorRef, Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit{

  @Input() encabezados: any[] = [];
  @Input() arraydata: any[] = [];
  @Input() columnas: any[] = [];
  @Output() CambioEstado = new EventEmitter<boolean>();
  dataFiltrada: any[] = [];
  paginaActual: number = 1;
  registrosPorPagina: number = 5;
  totalRegistros: number = 0;
  totalPaginas: number = 0;
  inicio: number = 0;
  fin: number = 0;

  constructor(
    private cdr: ChangeDetectorRef
  ){

  }

  ngOnChanges() {
    this.cdr.detectChanges();
    this.arraydata = [...this.arraydata];
    this.cargarUsuarios();
    this.cambiarRegistrosPorPagina();
  }

  ngOnInit() {    
    this.cargarUsuarios();    
  }

  cargarUsuarios() {
    this.totalRegistros = this.arraydata.length;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const rporpagina = Number(this.registrosPorPagina);
    this.totalRegistros = this.arraydata.length;
    this.totalPaginas = Math.ceil(this.totalRegistros / rporpagina);

    this.inicio = (this.paginaActual - 1) * rporpagina;
    this.fin = this.inicio + rporpagina;
    
    this.dataFiltrada = this.arraydata.slice(this.inicio, this.fin);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  irAPagina(pagina: number) {
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  cambiarRegistrosPorPagina() {
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }
  
  confirmarCambioEstado(usuario: any, event: Event) {
    event.preventDefault();
    this.CambioEstado.emit(usuario);
  }

  verDetalles(usuario: any) {
    console.log('Detalles del usuario:', usuario);
  }

  get totalPaginasArray() {
    return Array(this.totalPaginas).fill(0).map((_, i) => i + 1);
  }
}

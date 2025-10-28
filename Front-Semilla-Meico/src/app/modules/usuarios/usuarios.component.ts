import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UsuariosService } from './services/usuarios.service';
import { UserData } from '@core/interfaces/base/responseApi.interface';
import { SnackbarComponent } from '@core/components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  usuarios: UserData[] = [];
  usuariosFiltrados: UserData[] = [];
  usuariosPaginados: UserData[] = [];
  areas: any [] = [];
  sugerencias: UserData[] = [];
  dataFilter = [
    { data: 'true', displayName: 'Activo', state: false },
    { data: 'false', displayName: 'Inactivo', state: false }
  ];
  filtrosActivos = {
    estado: null as boolean | null,
    area: null as string | null,
    busqueda: "" as string
  };
  mostrarModal: boolean = false;
  usuarioSeleccionado: any = null;
  mensajeModal: string = "";
  snackBar = inject(MatSnackBar);
  filtro: string = "";
  paginaActual: number = 1;
  registrosPorPagina: number = 5;
  totalRegistros: number = 0;
  totalPaginas: number = 0;
  inicio: number = 0;
  fin: number = 0;
  usuarioDetalle: any;
  mostrarSidebarDetalle = false;
  isModalDeleteMood = false;

  constructor(
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ){ }

  ngOnInit(){
    this.CargarUsuarios();
  }

  CargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.usuarios = data.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          this.usuariosFiltrados = this.usuarios;
          this.totalRegistros = this.usuariosFiltrados.length;
          this.areas = this.getDistinctAreas().map(area => ({
            data: area,
            displayName: area,
            state: false
          }));
          this.actualizarPaginacion();
        } else {
          console.error('La respuesta no es un array:', data);
        }
      },
      (error) => {
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message: 'Ha ocurrido un error al cargar los usuarios',
            type: 'error'
          },
          duration: 3000,
          panelClass: 'custom-snackbar',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  solicitarEliminacion(usuario: any) {
    usuario = usuario ?? this.usuarioDetalle;

    this.usuariosService.EliminarUsuario(usuario.id).subscribe({
      next: (result) => {
        this.CargarUsuarios();
        this.mostrarModal = false;
        this.isModalDeleteMood = false;
        this.snackBar.openFromComponent(SnackbarComponent, {
          data: {
            message: 'Se ha eliminado el usuario correctamente',
            type: 'success'
          },
          duration: 3000,
          panelClass: 'custom-snackbar',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  manejarConfirmacion(confirmado: boolean) {
    if(confirmado && this.isModalDeleteMood){
      this.solicitarEliminacion(this.usuarioSeleccionado);
      return;
    }

    this.mostrarModal = false;
  }

  solicitarCambioEstado(usuario: any, event: Event){
    event.preventDefault();
    this.usuarioSeleccionado = usuario;
    this.mensajeModal = this.usuarioSeleccionado.estado ? 'Al inactivar este usuario se quitará el acceso a la aplicación.' : "";
    this.abrirModal();
  }

  actualizarPaginacion() {
    const rporpagina = Number(this.registrosPorPagina);
    this.totalRegistros = this.usuariosFiltrados.length;
    this.totalPaginas = Math.ceil(this.totalRegistros / rporpagina);
    this.inicio = (this.paginaActual - 1) * rporpagina;
    this.fin = this.inicio + rporpagina;
    this.usuariosPaginados = this.usuariosFiltrados.slice(this.inicio, this.fin);
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

  verDetalles(usuario: any) {
    this.usuarioDetalle = usuario;
    this.mostrarSidebarDetalle = true;
  }

  eliminarUsuario(usuario: any) {
    this.usuarioDetalle = usuario;
    this.mensajeModal = '¿Está seguro de que desea eliminar este usuario?';
    this.isModalDeleteMood = true;
    this.abrirModal();
  }

  cerrarSidebar(){
    this.mostrarSidebarDetalle = false;
  }

  get totalPaginasArray() {
    return Array(this.totalPaginas).fill(0).map((_, i) => i + 1);
  }

  aplicarFiltros() {
    const filtroLower = this.filtrosActivos.busqueda.toLowerCase().trim();
    this.usuariosFiltrados = this.usuarios.filter(u => {
      const coincideEstado = this.filtrosActivos.estado === null || u.estado === this.filtrosActivos.estado;
      const coincideArea = this.filtrosActivos.area === null || u.area === this.filtrosActivos.area;
      const coincideBusqueda = this.filtrosActivos.busqueda === "" || u.correo.toLowerCase().includes(filtroLower);
      return coincideEstado && coincideArea && coincideBusqueda;
    });
    this.actualizarPaginacion();
    this.cdr.detectChanges();
  }

  filtrarUsuarios() {
    const filtroLower = this.filtro.toLowerCase().trim();
    if (filtroLower === "") {
      this.sugerencias = [];
      this.filtrosActivos.busqueda = "";
      this.aplicarFiltros();
      return;
    }
    this.sugerencias = this.usuariosFiltrados.filter(usuario =>
      usuario.correo.toLowerCase().includes(filtroLower) ||
      usuario.nombre.toLowerCase().includes(filtroLower)
    ).slice(0, 5);
  }

  seleccionarUsuario(usuario: any) {
    this.filtrosActivos.busqueda = usuario.correo.split('@')[0];
    this.filtro = usuario.correo.split('@')[0];
    this.sugerencias = [];
    this.aplicarFiltros();
  }

  filtrarEstado(filters: any[]) {
    this.filtrosActivos.estado = filters.some(f => f.state)
      ? filters.find(f => f.state)?.data === 'true'
      : null;
    this.aplicarFiltros();
  }

  filtrarArea(filters: any[]) {
    this.filtrosActivos.area = filters.some(f => f.state)
      ? filters.find(f => f.state)?.data ?? null
      : null;
    this.aplicarFiltros();
  }

  getDistinctAreas(): string[] {
    return [...new Set(this.usuarios.map(u => u.area))];
  }
}

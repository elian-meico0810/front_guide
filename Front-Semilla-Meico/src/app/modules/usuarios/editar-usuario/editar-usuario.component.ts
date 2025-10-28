import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '@core/components/modal/modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@core/components/snackbar/snackbar.component';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css'
})

export class EditarUsuarioComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  usuarioForm: FormGroup;
  items: any;
  filteredItems: any;
  aplicaciones: any;
  aplicacionSeleccionada: string = "-1";
  mensajeError: string | null = null;
  estadoUsuario: boolean = true;
  estadoPreSeleccionado: boolean = true;
  rolSelected: boolean = true;
  errorUsuario: boolean = false;
  mensajeModal: string = '';
  snackBar = inject(MatSnackBar);
  isModalOpen: boolean = false;
  sugerencias: any[] = [];
  acordeonAbierto: boolean = false;
  idUsuario: string = "";
  empresasUsuario: any[] = [];
  usuarioPreseleccionado = {
    area: '',
    cargo: '',
    celular: '',
    ciudad: '',
    correo: '',
    nombre: ''
  };

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.usuarioForm = this.fb.group({
      nombreUsuario: [''],
      Nombre: [''],
      correo: [''],
      celular: ['',],
      area: [''],
      cargo: [''],
      ciudad: [''],
      rol: ['']
    });
  }

  async ngOnInit() {
    this.idUsuario = this.route.snapshot.paramMap.get('id')!;
    await this.buscarUsuario(Number(this.idUsuario));
  }

  async buscarUsuario(idUsuario: number): Promise<void> {
    this.cerrarError();
    this.usuariosService.getUsuario(idUsuario).subscribe({
      next: async ({ usuario, empresas }) => {
        if (usuario) {
          this.usuarioPreseleccionado = usuario;
          this.usuarioForm.patchValue({
            nombreUsuario: usuario.correo?.split('@')[0] || '',
            Nombre: usuario.nombre || '',
            correo: usuario.correo || '',
            celular: usuario.celular || '',
            area: usuario.area || '',
            cargo: usuario.cargo || '',
            ciudad: usuario.ciudad || ''
          });
          this.estadoUsuario = usuario.estado;
          this.estadoPreSeleccionado = usuario.estado;
        }
          this.empresasUsuario = empresas || [];
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
      }
    });
  }

  buscarSugerencias(term: string): void {
    if (!term) {
      this.sugerencias = [];
      return;
    }

    this.sugerencias = [];

    this.items.forEach((empresa: { list: any[]; name: any; idempresa: any; }) => {
      empresa.list.forEach((rol) => {
        if (
          rol.name.toLowerCase().includes(term.toLowerCase()) &&
          (!this.aplicacionSeleccionada || rol.idAplicacion == this.aplicacionSeleccionada)
        ) {
          this.sugerencias.push({
            empresa: empresa.name,
            rol: rol.name,
            idempresa: empresa.idempresa,
            idRol: rol.idRol,
            state: rol.state
          });
        }
      });
    });
    this.cdr.detectChanges();
  }

  haySeleccion(): boolean {
    return this.sugerencias.some(sugerencia => sugerencia.state);
  }

  limpiarFiltro(): void {
    this.sugerencias = [];
    this.usuarioForm.get('rol')?.setValue('');
  }

  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
  }

  cerrarError() {
    this.errorUsuario = false;
    this.mensajeError = null;
  }

  hasSameStatus() {
    return this.estadoPreSeleccionado === this.estadoUsuario;
  }

  hasUserDataChanges(userForm: FormGroup) {
    const newUser = {
      area: userForm.value.area,
      cargo: userForm.value.cargo,
      celular: userForm.value.celular,
      ciudad: userForm.value.ciudad,
      correo: userForm.value.correo,
      nombre: userForm.value.Nombre
    };

    const user = {
      area: this.usuarioPreseleccionado.area,
      cargo: this.usuarioPreseleccionado.cargo,
      celular: this.usuarioPreseleccionado.celular,
      ciudad: this.usuarioPreseleccionado.ciudad,
      correo: this.usuarioPreseleccionado.correo,
      nombre: this.usuarioPreseleccionado.nombre
    };

    return user == newUser;
  }

  async guardarUsuario() {
    if(!this.usuarioForm.invalid){
      console.log(this.usuarioForm);
      console.log(this.usuarioPreseleccionado);

      if (this.hasUserDataChanges(this.usuarioForm)) {
        this.mensajeError = "No hay cambios por aplicar";
        return;
      }

      const newUser = {
        area: this.usuarioForm.value.area,
        cargo: this.usuarioForm.value.cargo,
        celular: this.usuarioForm.value.celular,
        ciudad: this.usuarioForm.value.ciudad,
        correo: this.usuarioForm.value.correo,
        nombre: this.usuarioForm.value.Nombre
      };

      const Usuario = {
        usuario: this.usuarioForm.get('correo')?.value.split('@')[0],
        newUser: newUser,
        estado: this.estadoUsuario
      };

      this.mensajeModal = "¿Está seguro que desea guardar la información?";
      this.isModalOpen = true;
      const confirmado = await this.modal.openModal();
      this.isModalOpen = false;
      if (confirmado) {
        await this.usuariosService.editUsuario(Usuario).subscribe(
          (data) => {
            if (data) {
              this.router.navigate(['/usuarios']);
              this.snackBar.openFromComponent(SnackbarComponent, {
                data: {
                  message: 'El usuario ha sido editado exitosamente.',
                  type: 'success'
                },
                duration: 3000,
                panelClass: 'custom-snackbar',
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
            }
          },
          (error) => {
            console.error('Error al editar el usuario:', error?.message);
            this.mensajeError = "Ha ocurrido un error al editar el usuario";
          }
        );
      } else {
        console.log("El usuario canceló la acción.");
      }
    }

  }

  async cancelar() {
    this.isModalOpen = true;
    this.mensajeModal = "¿Está seguro que desea cancelar la operación?";
    const confirmado = await this.modal.openModal();
    this.isModalOpen = false;
    if (confirmado) {
      this.router.navigate(['/usuarios']);
    }
  }

  irInicio(){
    this.router.navigate(['/usuarios']);
  }
}


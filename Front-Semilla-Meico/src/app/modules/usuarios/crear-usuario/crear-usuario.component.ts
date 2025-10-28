import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { ChangeDetectorRef } from '@angular/core';
import { isNotEqual } from '@core/forms-validator/default-values-active-directory';
import { ModalComponent } from '@core/components/modal/modal.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@core/components/snackbar/snackbar.component';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})
export class CrearUsuarioComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  usuarioForm: FormGroup;
  items: any;
  filteredItems: any;
  aplicaciones: any;
  aplicacionSeleccionada: string = "-1";
  mensajeError: string | null = null;
  estadoUsuario: boolean = true;
  rolSelected: boolean = true;
  errorUsuario: boolean = false;
  mensajeModal: string = '';
  snackBar = inject(MatSnackBar);
  isModalOpen: boolean = false;
  sugerencias: any[] = [];
  acordeonAbierto: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ){
    this.usuarioForm = this.fb.group({
      nombreUsuario: ['', [isNotEqual('')]],
      Nombre: ['', [isNotEqual(''), isNotEqual('--')]],
      correo: ['', [isNotEqual(''), isNotEqual('--')]],
      celular: ['',],
      area: [''],
      cargo: [''],
      ciudad: [''],
      empresa: [''],
      rol: ['']
    });
  }

  async ngOnInit() {
    this.DetectarInput();
  }

  DetectarInput(): void {
    const nombreUsuario = this.usuarioForm.get('nombreUsuario')?.value;
    if(nombreUsuario != ""){
      this.buscarUsuario(nombreUsuario);
    }
  }

  async buscarUsuario(username: string): Promise<void> {
    this.cerrarError();
    this.items.forEach((empresa: { state: boolean; list: any[]; }) => {
      empresa.state = false;
      empresa.list.forEach(rol => {
        rol.state = false;
      });
    });
    this.usuarioForm.reset({
      nombreUsuario: username,
      Nombre: '',
      correo: '',
      celular: '',
      area: '',
      cargo: '',
      ciudad: '',
      empresa: '',
      rol: ''
    });
  }

  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
  }

  cerrarError() {
    this.errorUsuario = false;
    this.mensajeError = null;
  }

  async guardarUsuario() {
    if(!this.usuarioForm.invalid){
      const Usuario = {
        nombre: this.usuarioForm.get('Nombre')?.value,
        correo: this.usuarioForm.get('correo')?.value,
        area: this.usuarioForm.get('area')?.value,
        cargo: this.usuarioForm.get('cargo')?.value,
        celular: this.usuarioForm.get('celular')?.value,
        ciudad: this.usuarioForm.get('ciudad')?.value,
        estado: this.estadoUsuario
      };
      this.mensajeModal = "¿Está seguro que desea guardar la información?";
      this.isModalOpen = true;
      const confirmado = await this.modal.openModal();
      this.isModalOpen = false;
      if (confirmado) {
        await (await this.usuariosService.saveUsuario(Usuario)).subscribe(
          (data) => {
            if (data) {
              this.router.navigate(['/usuarios']);
              this.snackBar.openFromComponent(SnackbarComponent, {
                data: {
                  message: 'El usuario se ha creado exitosamente.',
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
            console.error('Error al guardar el usuario:', error?.message);
            this.mensajeError = "Ha ocurrido un error al crear el usuario";
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
}

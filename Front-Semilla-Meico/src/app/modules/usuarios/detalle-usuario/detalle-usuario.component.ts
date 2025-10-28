import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { ModalComponent } from '@core/components/modal/modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent implements OnInit {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @Input() userId!: string;
  @Input() mostrarSidebar: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  estadoUsuario: boolean = false;
  empresasUsuario: any[] = []

  usuarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({
      nombreUsuario: [''],
      Nombre: [''],
      correo: [''],
      celular: [''],
      area: [''],
      cargo: [''],
      ciudad: ['']
    });
  }

  ngOnInit() {
    if (this.userId) {
      this.cargarUsuario(Number(this.userId));
    }
  }

  cargarUsuario(userId: number) {
    this.usuariosService.getUsuario(userId).subscribe({
      next: ({ usuario, empresas }) => {
        if (usuario) {
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
        }
          this.empresasUsuario = empresas || [];
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
      }
    });
  }

  editarUsuario(){
    if (this.userId) {
      this.router.navigate(['/usuarios/editar', this.userId]);
    }

  }

  CerrarDetalle() {
    this.cerrar.emit();
  }
}

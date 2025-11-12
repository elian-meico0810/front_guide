import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationModalData {
  mensaje?: string;
  submensaje?: string;
  textoBotonAceptar?: string;
  textoBotonCancelar?: string;
  success?: boolean; 
    ocultarCancelar: boolean;
}

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  mensaje: string;
  submensaje?: string;
  textoBotonAceptar: string;
  textoBotonCancelar: string;
  success: boolean;
  ocultarCancelar?: boolean;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationModalData
  ) {
    this.mensaje = data.mensaje || '¿Deseas continuar con esta acción?';
    this.submensaje = data.submensaje;
    this.textoBotonAceptar = data.textoBotonAceptar || 'Aceptar';
    this.textoBotonCancelar = data.textoBotonCancelar || 'Cancelar';
    this.success = data.success !== undefined ? data.success : true;
    this.ocultarCancelar = data.ocultarCancelar || false; 
  }

  onAceptar() {
    this.dialogRef.close(true);
  }

  onCancelar() {
    this.dialogRef.close(false);
  }
}

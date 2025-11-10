import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface SuccessModalDialogData {
  mensaje?: string;
  submensaje?: string;
  textoBoton?: string;
  success?: boolean;
}

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css']
})
export class SuccessModalComponent {
  mensaje: string;
  textoBoton: string;
  success: boolean;

  constructor(
    public dialogRef: MatDialogRef<SuccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SuccessModalDialogData
  ) {
    this.mensaje = data.mensaje || 'Accion realiza con exito';
    this.textoBoton = data.textoBoton || 'Cerrar';
    this.success = data.success !== undefined ? data.success : true; // por defecto true
  }

  close() {
    this.dialogRef.close();
  }
}

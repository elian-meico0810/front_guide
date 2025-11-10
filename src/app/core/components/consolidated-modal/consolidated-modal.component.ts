import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConsolidatedDialogData {
  guias: any[];
}

@Component({
  selector: 'app-consolidated-modal',
  templateUrl: './consolidated-modal.component.html',
  styleUrls: ['./consolidated-modal.component.css']
})
export class ConsolidatedModalComponent {
  selectedGuias: any[] = [];
  causales: string[] = ['Entrega fallida', 'Dirección incorrecta', 'Cliente ausente', 'Otro motivo'];

  numeroGuiaSeleccionada: string = '';
  causalSeleccionada: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConsolidatedModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConsolidatedDialogData
  ) {
    // Datos de prueba si no se recibe desde el padre
    this.selectedGuias = data?.guias?.length ? data.guias : [
      { numeroGuia: '000001', estado: 'confirmado' },
      { numeroGuia: '000002', estado: 'pendiente' },
      { numeroGuia: '000003', estado: 'confirmado' },
      { numeroGuia: '000004', estado: 'pendiente' },
      { numeroGuia: '000005', estado: 'confirmado' },
      { numeroGuia: '000005', estado: 'confirmado' },
      { numeroGuia: '000005', estado: 'confirmado' },
      { numeroGuia: '000005', estado: 'confirmado' },
      { numeroGuia: '000005', estado: 'confirmado' },
      { numeroGuia: '000005', estado: 'confirmado' },
      { numeroGuia: '000005', estado: 'confirmado' },
      { numeroGuia: '000005', estado: 'confirmado' },
      { numeroGuia: '000005', estado: 'confirmado' },
      { numeroGuia: '000005', estado: 'confirmado' },
      { numeroGuia: '000005', estado: 'confirmado' },
      { numeroGuia: '000005', estado: 'confirmado' },
    ];
  }

  cancel(): void {
    this.dialogRef.close();
  }

  send(): void {
    this.dialogRef.close({
      guia: this.numeroGuiaSeleccionada,
      causal: this.causalSeleccionada,
      guias: this.selectedGuias
    });
  }
}

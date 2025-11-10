import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddFileModalComponent } from '../add-file/add-file-modal.component';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { ActivatedRoute } from '@angular/router';

export interface AddConsignacionDialogData {
  numeroGuia?: string;
}

@Component({
  selector: 'app-add-consignacion-modal',
  templateUrl: './add-consignacion-modal.component.html',
  styleUrls: ['./add-consignacion-modal.component.css']
})
export class AddConsignacionModalComponent {
  numeroGuia: string = '';
  isOpen = false;
  tipoConsignacion: string = '';
  tiposConsignacion: string[] = ['Depósito', 'Transferencia', 'Efectivo', 'Otro'];
  selectedFile: File | null = null;
  valor: number | null = null;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddConsignacionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddConsignacionDialogData
  ) {
  }

  ngOnInit() {
    this.numeroGuia = this.data.numeroGuia ?? '';
  }

  cancel(): void {
    this.dialogRef.close();
  }

  seleccionarTipo(tipo: string) {
    this.tipoConsignacion = tipo;
    this.isOpen = false;
  }
  add(): void {
    if (this.numeroGuia) {
      this.dialog.open(SuccessModalComponent, {
        data: {
          mensaje: 'Consignación agregada a Guía ' + this.numeroGuia,
          textoBoton: 'Regresar'
        }
      });
      this.dialogRef.close({ numeroGuia: this.numeroGuia });

    }
  }

  formatearValor(event: any) {
    let valor = event.target.value;

    valor = valor.replace(/\D/g, '');

    valor = valor.replace(/^0+/, '');

    if (valor) {
      valor = parseInt(valor, 10).toLocaleString('es-CO');
    }

    event.target.value = valor;
  }

  file() {
    const dialogRef = this.dialog.open(AddFileModalComponent, {
      width: '540px',
      disableClose: false,
      data: { numeroGuia: this.numeroGuia }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedFile = result as File;
      }
    });
  }

  removeFile() {
    this.selectedFile = null;
  }

}

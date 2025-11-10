import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SuccessModalComponent } from '../success-modal/success-modal.component';

export interface AddFileDialogData {
  defaultNumber?: string;
}

@Component({
  selector: 'app-add-file-modal',
  templateUrl: './add-file-modal.component.html',
  styleUrls: ['./add-file-modal.component.css']
})
export class AddFileModalComponent {
  numeroGuia: string = '';
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddFileModalComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AddFileDialogData
  ) {
    this.numeroGuia = data?.defaultNumber ?? '';
  }


  onFileSelected(event: any) {
    const file = event?.target?.files?.[0] ?? null;
    if (file) {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
    }
  }

  cancel() {
    this.dialogRef.close();
  }


  save() {
    this.dialog.open(SuccessModalComponent, {
      data: {
        mensaje: 'Archivo cargado exitosamente',
        textoBoton: 'Continuar'
      }
    });
    this.dialogRef.close(this.selectedFile ?? null);

  }
}

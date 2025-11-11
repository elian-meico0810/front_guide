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
      // Obtener la extensión del archivo
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        // Archivo permitido
        this.selectedFile = file;
      } else {
        // Archivo no permitido
        this.selectedFile = null;

        // Mostrar mensaje de error
        this.dialog.open(SuccessModalComponent, {
          data: {
            mensaje: 'Tipo de archivo no permitido. Solo se permiten jpg, png o pdf.',
            textoBoton: 'Cerrar',
            success: false
          }
        });
      }
    } else {
      this.selectedFile = null;
    }
  }


  cancel() {
    this.dialogRef.close();
  }


  save() {
    if (!this.selectedFile) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const fileName = this.selectedFile!.name;

      console.log("base64String: ", base64String)
      console.log("fileName: ", fileName)
      // Abrir modal de éxito
      this.dialog.open(SuccessModalComponent, {
        data: {
          mensaje: 'Archivo cargado exitosamente',
          textoBoton: 'Continuar',
          success: true
        }
      });

      // Cerrar modal y devolver un objeto con Base64 y nombre
      this.dialogRef.close({
        base64: base64String,
        name: fileName
      });
    };

    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      this.dialog.open(SuccessModalComponent, {
        data: {
          mensaje: 'Error al cargar el archivo',
          textoBoton: 'Cerrar',
          success: false
        }
      });
    };

    reader.readAsDataURL(this.selectedFile); // convierte el archivo a Base64
  }

}

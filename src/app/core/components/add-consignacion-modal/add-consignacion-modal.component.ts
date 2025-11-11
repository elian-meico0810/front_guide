import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddFileModalComponent } from '../add-file/add-file-modal.component';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { ActivatedRoute } from '@angular/router';
import { TokenRute } from '@core/enum/type-content.enum';
import { HttpBaseAppService } from '@core/services/http-base-app.service';
import { Environment } from '@core/config/environment';
import { ResponseConsignacion } from 'src/app/interface/response';

export interface AddConsignacionDialogData {
  numeroGuia?: string;
}

export interface UploadedFile {
  base64: string;
  name: string;
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
  selectedFile: UploadedFile | null = null;
  valor: number | null = null;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private httpBaseApp: HttpBaseAppService,
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

  sendConsignacion() {
    // Obtenemos el token desde localStorage (JWT guardado por LoginService)
    const token = TokenRute.TOKEN

    if (!token) {
      console.error('No se encontró token');
      return;
    }

    // Body de la petición
    const valorProcesado = this.valor
      ? parseFloat(this.valor.toString().replace(/\./g, '').replace(',', '.')).toFixed(2)
      : '0.00';

    const bodyParams = {
      numero_guia: this.numeroGuia,
      numero_planilla: 1001,
      nombre_archivo:this.selectedFile?.name || null,
      tipo_consignacion: this.tipoConsignacion,
      valor_consignacion: valorProcesado,
      ruta_archivo_soporte: this.selectedFile?.base64 || null,
    };


    // Headers con Authorization
    const httpHeaders = [
      { campo: 'Authorization', valor: `Bearer ${token}` }
    ];

    // Llamada POST
    this.httpBaseApp.post<ResponseConsignacion>(
      Environment.SEND_CONSIGNACIONES,
      bodyParams,
      [],
      httpHeaders
    ).subscribe({
      next: (res) => {
        this.dialog.open(SuccessModalComponent, {
          data: {
            mensaje: res.success
              ? 'Consignación enviada correctamente'
              : res.messages, // si falla, mostrar mensaje de error
            textoBoton: 'Cerrar',
            success: res.success // true = check azul, false = X roja
          }
        });

        if (res.success) {
          this.dialogRef.close({ numeroGuia: this.numeroGuia });
        }
      },
      error: (err) => {
        console.error('Error al enviar consignación', err);
        this.dialog.open(SuccessModalComponent, {
          data: {
            mensaje: 'Error al enviar consignación',
            textoBoton: 'Cerrar',
            success: false
          }
        });
      }
    });

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
        // result ahora es { base64: string, name: string }
        this.selectedFile = {
          base64: result.base64,
          name: result.name
        };
        console.log('Archivo cargado:', this.selectedFile);
      }
    });
  }


  removeFile() {
    this.selectedFile = null;
  }

}

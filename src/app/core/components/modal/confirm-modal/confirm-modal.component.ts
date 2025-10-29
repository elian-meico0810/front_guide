import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  @Input() mensaje: string = "";
  @Output() confirmar = new EventEmitter<boolean>();

  cerrarModal(confirmado: boolean) {
    this.confirmar.emit(confirmado);
  }
}

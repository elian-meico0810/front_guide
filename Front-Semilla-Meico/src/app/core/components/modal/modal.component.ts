import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() mensaje: string = '';
  isModalOpen = false;
  private resolveFunction: ((value: boolean) => void) | null = null;

  openModal(): Promise<boolean> {
    this.isModalOpen = true;
    return new Promise<boolean>((resolve) => {
      this.resolveFunction = resolve;
    });
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

  confirmar() {
    this.resolveFunction?.(true);
    this.closeModal();
  }

  cancelar() {
    this.resolveFunction?.(false);
    this.closeModal();
  }
}

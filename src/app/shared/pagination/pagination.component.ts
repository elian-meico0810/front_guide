import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  /** Total de elementos */
  @Input() totalItems: number = 0;
  /** Página actual */
  @Input() currentPage: number = 1;
  /** Elementos por página */
  @Input() perPage: number = 10;
  /** Deshabilitar botones mientras carga */
  @Input() loading: boolean = false;

  /** Evento cuando cambia la página */
  @Output() pageChange = new EventEmitter<number>();

  /** Calcular número total de páginas */
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.perPage);
  }

  /** Array de páginas para iterar en la vista */
  get pages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2; // Número de páginas visibles a cada lado
    const range = [];

    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }
    return range;
  }

  /** Cambiar página */
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || this.loading) return;
    this.pageChange.emit(page);
  }
}

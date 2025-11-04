import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() perPage: number = 10;
  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<number>();

  pages: (number | string)[] = [];
  pageSizes: number[] = [5, 10, 20];

  ngOnChanges(changes: SimpleChanges): void {
    this.generatePages();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.perPage);
  }

  generatePages() {
    const total = this.totalPages;
    const current = this.currentPage;
    const visibleRange = 5; // cantidad máxima de páginas visibles
    const pages: (number | string)[] = [];

    if (total <= visibleRange + 2) {
      // si hay pocas páginas, las mostramos todas
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      // siempre mostramos la primera y la última
      const start = Math.max(2, current - 2);
      const end = Math.min(total - 1, current + 2);

      pages.push(1);

      if (start > 2) pages.push('…');

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < total - 1) pages.push('…');

      pages.push(total);
    }

    this.pages = pages;
  }

  changePage(page: number | string) {
    if (typeof page !== 'number') return;
    if (page < 1 || page > this.totalPages) return;
    this.pageChange.emit(page);
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.perPageChange.emit(newSize);
  }
}

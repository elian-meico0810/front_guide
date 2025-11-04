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

  pages: number[] = [];
  pageSizes: number[] = [5, 10, 20];

  ngOnChanges(changes: SimpleChanges): void {
    this.generatePages();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.perPage);
  }

  generatePages() {
    const totalPages = this.totalPages;
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    this.pageChange.emit(page);
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.perPageChange.emit(newSize);
  }
}

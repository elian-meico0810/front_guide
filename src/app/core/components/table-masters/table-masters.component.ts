import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-table-masters',
  templateUrl: './table-masters.component.html',
  styleUrls: ['./table-masters.component.css']
})
export class TableMastersComponent implements OnInit, OnChanges {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];
  @Input() showActions = false;

  @Output() viewItem = new EventEmitter<any>();
  @Output() filterColumn = new EventEmitter<{ key: string; value: string }>();

  activeFilter: string | null = null;
  filteredData: any[] = [];

  ngOnInit() {
    this.filteredData = [...this.data];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.filteredData = [...this.data];
    }
  }

  onView(item: any) {
    this.viewItem.emit(item);
  }

  onFilter(col: { key: string; label: string }) {
    this.activeFilter = this.activeFilter === col.key ? null : col.key;
  }

  closeFilter() {
    this.activeFilter = null;
  }

  /** emite al padre el valor seleccionado */
  selectFilter(colKey: string, value: string) {
    this.filterColumn.emit({ key: colKey, value });
    this.closeFilter();
  }

  clearFilter(colKey: string) {
    this.filterColumn.emit({ key: colKey, value: '' });
    this.closeFilter();
  }

  getUniqueValues(key: string): string[] {
    return Array.from(new Set(this.data.map(item => item[key]))).filter(Boolean);
  }
}

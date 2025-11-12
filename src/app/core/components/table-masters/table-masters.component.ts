import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-table-masters',
  templateUrl: './table-masters.component.html',
  styleUrls: ['./table-masters.component.css']
})
export class TableMastersComponent implements OnInit, OnChanges {
  @Input() columns: { key: string; label: string; type?: string; filter?: boolean }[] = [];
  @Input() data: any[] = [];
  @Input() showActions = false;

  @Output() viewItem = new EventEmitter<any>();
  @Output() filterColumn = new EventEmitter<{ key: string; value: string }>();
  @Output() openFile = new EventEmitter<any>();

  activeFilter: string | null = null;
  filteredData: any[] = [];
  filters: { [key: string]: string } = {};

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

  onFilter(col: { key: string; label: string; filter?: boolean }) {
    if (!col.filter) return;
    this.activeFilter = this.activeFilter === col.key ? null : col.key;
  }

  closeFilter() {
    this.activeFilter = null;
  }

  /** Aplica filtro local y emite al padre */
  selectFilter(colKey: string, value: string) {
    this.filters[colKey] = value;

    this.filteredData = this.data.filter(item =>
      (item[colKey] ?? '').toString().toLowerCase().includes(value.toLowerCase())
    );

    this.filterColumn.emit({ key: colKey, value });
    this.closeFilter();
  }

  clearFilter(colKey: string) {
    delete this.filters[colKey];
    this.filteredData = [...this.data];
    this.filterColumn.emit({ key: colKey, value: '' });
    this.closeFilter();
  }

  getUniqueValues(key: string): string[] {
    return Array.from(new Set(this.data.map(item => item[key]))).filter(Boolean);
  }

  /** Formatea fechas */
  formatDate(value: any): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }
  /** Formatea moneda en COP */
  formatCurrency(value: any): string {
    if (value == null || value === '') return '';
    const num = Number(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    });
  }

  capitalizeFirst(value: string): string {
    if (!value) return '';
    const lower = value.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  formatEstado(value: string): string {
    if (!value) return 'Sin estado';

    const lower = value.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

}

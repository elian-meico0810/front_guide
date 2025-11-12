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
  @Input() filterOptions: any[] = []; // Opcional: filtros desde API

  @Output() viewItem = new EventEmitter<any>();
  @Output() filterColumn = new EventEmitter<{ key: string; value: string }>();
  @Output() openFile = new EventEmitter<any>();

  filteredData: any[] = [];
  activeFilter: string | null = null;
  filters: { [key: string]: string } = {};

  ngOnInit() {
    this.filteredData = [...this.data];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.applyAllFilters();
    }
  }

  onView(item: any) {
    this.viewItem.emit(item);
  }

  onFilter(col: { key: string; filter?: boolean }) {
    if (!col.filter) return;
    this.activeFilter = this.activeFilter === col.key ? null : col.key;
  }

  closeFilter() {
    this.activeFilter = null;
  }

  selectFilter(colKey: string, value: string) {
    this.filters[colKey] = value;
    this.applyAllFilters();
    this.filterColumn.emit({ key: colKey, value });
    this.closeFilter();
  }

  clearFilter(colKey: string) {
    delete this.filters[colKey];
    this.applyAllFilters();
    this.filterColumn.emit({ key: colKey, value: '' });
    this.closeFilter();
  }

  private applyAllFilters() {
    this.filteredData = [...this.data];

    for (const key in this.filters) {
      const filterVal = this.filters[key].toLowerCase();
      if (filterVal) {
        this.filteredData = this.filteredData.filter(item =>
          (item[key] ?? '').toString().toLowerCase().includes(filterVal)
        );
      }
    }
  }

  getUniqueValues(key: string): string[] {
    if (this.filterOptions.length > 0) {
      return Array.from(new Set(this.filterOptions.map(item => item[key]))).filter(Boolean);
    }
    return Array.from(new Set(this.data.map(item => item[key]))).filter(Boolean);
  }

  formatDate(value: any): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  formatCurrency(value: any): string {
    if (value == null || value === '') return '';
    const num = Number(value);
    return isNaN(num) ? value : num.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });
  }

  formatEstado(value: string): string {
    if (!value) return 'Sin estado';
    const lower = value.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
}

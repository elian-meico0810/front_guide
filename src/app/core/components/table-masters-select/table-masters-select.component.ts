import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DbEnums } from '@core/config/db';

@Component({
  selector: 'app-table-masters-select',
  templateUrl: './table-masters-select.component.html',
  styleUrls: ['./table-masters-select.component.css']
})
export class TableMastersSelectComponent implements OnInit, OnChanges {
  @Input() columns: { key: string; label: string; type?: string; filter?: boolean }[] = [];
  @Input() data: any[] = [];
  @Input() showActions = false;

  @Output() deleteItem = new EventEmitter<any>();
  @Output() viewItem = new EventEmitter<any>();
  @Output() filterColumn = new EventEmitter<{ key: string; value: string }>();
  @Input() filterOptions: any[] = [];

  // selección
  selectedItems: any[] = [];
  selectAll = false;
  activeFilter: string | null = null;
  DbEnums = DbEnums;

  // filtros
  filters: { [key: string]: string } = {};
  originalData: any[] = [];
  filteredData: any[] = [];

  ngOnInit() {
    this.originalData = [...this.data];
    this.filteredData = [...this.data];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.originalData = [...this.data];
      this.filteredData = [...this.data];
      this.updateSelectionState();
    }
  }

  // Selección individual
  updateSelection(item: any) {
    this.selectedItems = this.filteredData.filter(d => d.selected);
    this.selectAll = this.selectedItems.length === this.filteredData.length;
  }

  // Selección/deselección de todos
  toggleAllSelections() {
    this.filteredData.forEach(item => (item.selected = this.selectAll));
    this.selectedItems = this.selectAll ? [...this.filteredData] : [];
  }

  // Eliminar fila
  onDelete(item: any) {
    this.deleteItem.emit(item);
    this.filteredData = this.filteredData.filter(d => d !== item);
    this.originalData = this.originalData.filter(d => d !== item);
    this.updateSelection(item);
  }

  // Emitir ver detalle
  onView(item: any) {
    this.viewItem.emit(item);
  }

  // Aplicar filtro local y emitir al padre
  applyFilter(colKey: string, value: any) {
    this.filters[colKey] = value;

    this.filterColumn.emit({ key: colKey, value });

    this.filteredData = this.originalData.filter(item => {
      const filterVal = (value ?? '').toString().toLowerCase();
      const cellVal = (item[colKey] ?? '').toString().toLowerCase();
      return cellVal.includes(filterVal);
    });

    this.updateSelectionState();
  }


  clearFilter(colKey: string) {
    this.applyFilter(colKey, '');
  }

  getUniqueValues(key: string): string[] {
    if (this.filterOptions.length > 0) {
      return Array.from(new Set(this.filterOptions.map(item => item[key]))).filter(Boolean);
    }
    return Array.from(new Set(this.originalData.map(item => item[key]))).filter(Boolean);
  }


  private updateSelectionState() {
    this.selectedItems = this.filteredData.filter(d => d.selected);
    this.selectAll = this.selectedItems.length === this.filteredData.length;
  }

  onFilter(col: { key: string; label: string }) {
    this.activeFilter = this.activeFilter === col.key ? null : col.key;
  }

  selectFilter(colKey: string, value: string) {
    this.applyFilter(colKey, value);
    this.closeFilter();
  }

  closeFilter() {
    this.activeFilter = null;
  }


  formatDate(value: any): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }

  formatCurrency(value: any): string {
    if (value == null || value === '') return '';
    const numberValue = Number(value);
    return numberValue.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    });
  }

}

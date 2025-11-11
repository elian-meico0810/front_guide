import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DbEnums } from '@core/config/db';

@Component({
  selector: 'app-table-masters-select',
  templateUrl: './table-masters-select.component.html',
  styleUrls: ['./table-masters-select.component.css']
})
export class TableMastersSelectComponent implements OnInit, OnChanges {
  @Input() columns: { key: string; label: string; type?: string }[] = [];
  @Input() data: any[] = [];
  @Input() showActions = false;

  @Output() deleteItem = new EventEmitter<any>();
  @Output() viewItem = new EventEmitter<any>();
  @Output() filterColumn = new EventEmitter<{ key: string; value: string }>();

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
  applyFilter(colKey: string, value: any) { // value puede ser cualquier tipo
    // Guardar el filtro
    this.filters[colKey] = value;

    // Emitir al padre
    this.filterColumn.emit({ key: colKey, value });

    // Convertir valor del filtro a string seguro
    const filterValueSafe = (value !== null && value !== undefined) ? String(value).toLowerCase() : '';

    // Filtrado local
    this.filteredData = this.originalData.filter(item => {
      return Object.keys(this.filters).every(key => {
        const filterVal = this.filters[key];

        if (filterVal === null || filterVal === undefined || filterVal === '') return true;

        const cellValue = item[key];
        if (cellValue === null || cellValue === undefined) return false;

        // Convertir la celda a string seguro
        const cellString = String(cellValue);

        return cellString.toLowerCase().includes(filterValueSafe);
      });
    });

    this.updateSelectionState();
  }

  clearFilter(colKey: string) {
    this.applyFilter(colKey, '');
  }

  getUniqueValues(key: string): string[] {
    return Array.from(new Set(this.originalData.map(item => item[key]))).filter(Boolean);
  }

  private updateSelectionState() {
    this.selectedItems = this.filteredData.filter(d => d.selected);
    this.selectAll = this.selectedItems.length === this.filteredData.length;
  }

  onFilter(col: { key: string; label: string }) {
    this.activeFilter = this.activeFilter === col.key ? null : col.key;
  }

  // Selecciona un valor de filtro desde el dropdown y aplica el filtrado
  selectFilter(colKey: string, value: string) {
    this.applyFilter(colKey, value);
    this.closeFilter();
  }

  // Cerrar dropdown de filtro
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
    }); // Ej: "Oct 28, 2025"
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

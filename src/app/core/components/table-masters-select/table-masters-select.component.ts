import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-masters-select',
  templateUrl: './table-masters-select.component.html',
  styleUrls: ['./table-masters-select.component.css']
})
export class TableMastersSelectComponent {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];
  @Input() showActions = false;

  @Output() deleteItem = new EventEmitter<any>(); // 🔹 nuevo evento individual

  selectedItems: any[] = [];
  selectAll = false;


  // Eliminar individual
  onDelete(item: any) {
    this.deleteItem.emit(item);
    this.data = this.data.filter(d => d !== item);
    this.updateSelection(item);
  }

  // Selección individual
  updateSelection(item: any) {
    this.selectedItems = this.data.filter(d => d.selected);
    this.selectAll = this.selectedItems.length === this.data.length;
  }

  // Seleccionar/deseleccionar todos
  toggleAllSelections() {
    this.data.forEach(item => (item.selected = this.selectAll));
    this.selectedItems = this.selectAll ? [...this.data] : [];
  }
}

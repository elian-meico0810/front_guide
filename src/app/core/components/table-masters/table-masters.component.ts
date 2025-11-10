import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-masters',
  templateUrl: './table-masters.component.html',
  styleUrls: ['./table-masters.component.css']
})
export class TableMastersComponent {
  @Input() columns: { key: string; label: string }[] = [];

  @Input() data: any[] = [];

  @Input() showActions = false;

  @Output() viewItem = new EventEmitter<any>();

  @Output() filterColumn = new EventEmitter<string>();

  onView(item: any) {
    this.viewItem.emit(item);
  }
  onFilter(col: { key: string; label: string }) {
    // Aquí puedes abrir un modal, mostrar un input de búsqueda o aplicar un filtro
  }

}

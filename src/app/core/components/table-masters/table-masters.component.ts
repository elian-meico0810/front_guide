import { Component, Input, Output, EventEmitter  } from '@angular/core';

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

  onView(item: any) {
    this.viewItem.emit(item);
  }
}

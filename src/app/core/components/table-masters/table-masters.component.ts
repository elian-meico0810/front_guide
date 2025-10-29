import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-masters',
  templateUrl: './table-masters.component.html',
  styleUrls: ['./table-masters.component.css']
})
export class TableMastersComponent {
  @Input() columns: { key: string; label: string }[] = [];

  @Input() data: any[] = [];

  @Input() showActions = false;
}

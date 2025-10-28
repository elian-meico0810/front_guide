import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-filter-option',
  templateUrl: './filter-option.component.html',
  styleUrl: './filter-option.component.css'
})
export class FilterOptionComponent {

  @Input() dataFilter: any[] = []//[{ data: "a", displayName: "A", state: false }, { data: "b", displayName: "B", state: false }, { data: "c", displayName: "C", state: false }]
  @Input() multiple: boolean = false
  @Output() changeData = new EventEmitter<any>()
  activo: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef
  ){

  }

  reset() {
    this.dataFilter = this.dataFilter.map(data => {
      data.state = false
      return data
    });
    console.log(this.dataFilter);
  }

  select(item: any) {
    if (!this.multiple) {
      this.dataFilter = this.dataFilter.map(element => {
        if (element.data != item.data) {
          element.state = false
          return element
        }else{
          return element
        }
      })
    }
  }

  Ok(menuTrigger: MatMenuTrigger) {
    this.changeData.emit(this.dataFilter.filter(data => data.state == true));
    this.activo = this.dataFilter.some(f => f.state);
    this.cdr.detectChanges();
    menuTrigger.closeMenu();
  }
}

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchText: string = ''; 


  @Output() searchTextChange: EventEmitter<string> = new EventEmitter<string>();

  onSearchChange() {
    this.searchTextChange.emit(this.searchText); // Emite el texto de búsqueda
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-totalizer',
  templateUrl: './totalizer.component.html',
  styleUrls: ['./totalizer.component.css']
})
export class TotalizerComponent {
  @Input() label!: string;
  @Input() value!: number;

  get formattedValue(): string {
    // Convierte el número a string y agrega puntos como separador de miles
    return this.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || '0';
  }
}

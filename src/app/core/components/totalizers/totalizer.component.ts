import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-totalizer',
  templateUrl: './totalizer.component.html',
  styleUrls: ['./totalizer.component.css']
})
export class TotalizerComponent {
  @Input() label!: string;
  @Input() value!: number;
}

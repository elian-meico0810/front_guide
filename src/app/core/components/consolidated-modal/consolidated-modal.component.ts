import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConsolidatedDialogData {
  guias: any[];
}

@Component({
  selector: 'app-consolidated-modal',
  templateUrl: './consolidated-modal.component.html',
  styleUrls: ['./consolidated-modal.component.css']
})
export class ConsolidatedModalComponent {
  selectedGuias: any[] = [];
  
  constructor(
    public dialogRef: MatDialogRef<ConsolidatedModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConsolidatedDialogData
  ) {
    this.selectedGuias = data.guias || [];
  }

  cancel(): void {
    this.dialogRef.close();
  }

  send(): void {
    this.dialogRef.close(this.selectedGuias);
  }
}
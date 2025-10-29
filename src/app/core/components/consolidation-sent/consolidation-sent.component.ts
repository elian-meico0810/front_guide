import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConsolidationSentData {
  dateLabel?: string;
  message?: string;
}

@Component({
  selector: 'app-consolidation-sent',
  templateUrl: './consolidation-sent.component.html',
  styleUrls: ['./consolidation-sent.component.css']
})
export class ConsolidationSentComponent {
  constructor(
    public dialogRef: MatDialogRef<ConsolidationSentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConsolidationSentData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}

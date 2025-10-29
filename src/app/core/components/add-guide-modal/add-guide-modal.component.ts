import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface AddGuideDialogData {
  defaultNumber?: string;
}

@Component({
  selector: 'app-add-guide-modal',
  templateUrl: './add-guide-modal.component.html',
  styleUrls: ['./add-guide-modal.component.css']
})
export class AddGuideModalComponent {
  numeroGuia: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddGuideModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddGuideDialogData
  ) {
    this.numeroGuia = data?.defaultNumber ?? '';
  }

  cancel(): void {
    this.dialogRef.close();
  }

  add(): void {
    if (!this.numeroGuia) {
      return;
    }

    this.dialogRef.close({ numeroGuia: this.numeroGuia });
  }
}

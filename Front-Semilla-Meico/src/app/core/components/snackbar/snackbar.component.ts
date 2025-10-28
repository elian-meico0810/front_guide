import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {
  iconClass: string = '';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<SnackbarComponent>
  ) {
    this.iconClass = data.type === 'success' ? 'mgc_check_circle_fill' : 'mgc_close_circle_fill';
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}

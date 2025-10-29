import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { HasPermissionDirective } from "./directives/has-permission.directive";
import { MatDividerModule } from "@angular/material/divider";
import { DisableHasPermissionDirective } from "./directives/disable.directive";

@NgModule({
  declarations: [HasPermissionDirective, DisableHasPermissionDirective],
  providers: [{ provide: MatDialogRef, useValue: {} }],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatDividerModule
  ],
  exports: [
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    HasPermissionDirective,
    DisableHasPermissionDirective
  ]
})
export class SharedModule { }

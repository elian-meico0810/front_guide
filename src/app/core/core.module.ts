import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { MaterialModule } from "./material.module";
import { RouterLink } from "@angular/router";
import { AcordeonComponent } from "./components/acordeon/acordeon.component";
import { FilterOptionComponent } from "./components/filter-option/filter-option.component";
import { ModalComponent } from "./components/modal/modal.component";
import { TableComponent } from "./components/table/table.component";
import { ConfirmModalComponent } from "./components/modal/confirm-modal/confirm-modal.component";
import { CardComponent } from "./components/card/card.component";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { RouterModule } from '@angular/router';
import { TotalizerComponent } from "./components/totalizers/totalizer.component";
import { TableMastersComponent } from "./components/table-masters/table-masters.component";
import { AddGuideModalComponent } from './components/add-guide-modal/add-guide-modal.component';
import { ConsolidationSentComponent } from './components/consolidation-sent/consolidation-sent.component';
import { TableMastersSelectComponent } from "./components/table-masters-select/table-masters-select.component";


@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    AcordeonComponent,FilterOptionComponent,
    ModalComponent,
    TableComponent,
    ConfirmModalComponent,
    CardComponent,
    SearchBarComponent,
    TotalizerComponent,
    TableMastersComponent,
    TableMastersSelectComponent,
    AddGuideModalComponent,
    ConsolidationSentComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    AcordeonComponent,
    FilterOptionComponent,
    ModalComponent,
    ConfirmModalComponent,
    CardComponent,
    SearchBarComponent,
    TableComponent,
    TotalizerComponent,
    TableMastersComponent,
    TableMastersSelectComponent,
    AddGuideModalComponent,
    ConsolidationSentComponent,
  ]
})
export class CoreModule { }

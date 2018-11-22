import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatToolbarModule,
    MatRippleModule
  } from '@angular/material';


import { AppComponent } from './app.component';
import { RiderListComponent, AddRiderDialog } from './rider-list/rider-list.component';


@NgModule({
  entryComponents: [
    AppComponent,
    RiderListComponent,
    AddRiderDialog,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatToolbarModule,
    MatRippleModule,
  ],
  declarations: [
    AppComponent,
    RiderListComponent,
    AddRiderDialog,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

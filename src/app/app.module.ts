import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule }    from '@angular/common/http';

import {
    MatTableModule,
    MatListModule,
    MatGridListModule,
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
import { RiderListComponent } from './rider-list/rider-list.component';
import { AddRiderDialogComponent } from './add-rider-dialog/add-rider-dialog.component';


@NgModule({
  entryComponents: [
    AppComponent,
    RiderListComponent,
    AddRiderDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatListModule,
    MatGridListModule,
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
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    RiderListComponent,
    AddRiderDialogComponent,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

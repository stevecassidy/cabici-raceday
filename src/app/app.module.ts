import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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


import { AppComponent }  from './app.component';
import { RiderListComponent, AddRiderDialog } from './rider-list.component';

@NgModule({
  imports:      [ 
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
  entryComponents: [
    AppComponent,
    RiderListComponent,
    AddRiderDialog,
  ],
  declarations: [
    AppComponent,
    RiderListComponent,
    AddRiderDialog,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {Route, RouterModule, ROUTES} from '@angular/router';

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
    MatRippleModule,
    MatIconModule
  } from '@angular/material';


import { AppComponent } from './app/app.component';
import { RiderListComponent } from './rider-list/rider-list.component';
import { AddRiderDialogComponent } from './add-rider-dialog/add-rider-dialog.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import { HeaderComponent } from './header/header.component';
import { RaceChooserComponent } from './race-chooser/race-chooser.component';
import { RaceEntryComponent } from './race-entry/race-entry.component';

const ROUTES: Route[] = [
  {path: '', component: RaceEntryComponent},
  {path: 'races', component: RaceChooserComponent},
  {path: 'entries', component: RaceEntryComponent}
];


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
    MatIconModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES)
  ],
  declarations: [
    AppComponent,
    RiderListComponent,
    AddRiderDialogComponent,
    EntryListComponent,
    HeaderComponent,
    RaceChooserComponent,
    RaceEntryComponent,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

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


import { AppComponent } from './app.component';
import { RiderListComponent } from './rider-list/rider-list.component';
import { AddRiderDialogComponent } from './add-rider-dialog/add-rider-dialog.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import { HeaderComponent } from './header/header.component';
import { RaceChooserComponent } from './race-chooser/race-chooser.component';

const ROUTES: Route[] = [
  {path: '', component: RaceChooserComponent},
  {path: 'riders', component: RiderListComponent}
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
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

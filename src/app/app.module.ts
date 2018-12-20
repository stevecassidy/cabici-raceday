import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {Route, RouterModule} from '@angular/router';

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
  MatIconModule,
  MatRadioModule, MatCardModule
} from '@angular/material';


import { AppComponent } from './app/app.component';
import { RiderListComponent } from './rider-list/rider-list.component';
import { AddRiderDialogComponent } from './add-rider-dialog/add-rider-dialog.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import { HeaderComponent } from './header/header.component';
import { RaceChooserComponent } from './race-chooser/race-chooser.component';
import { RaceEntryComponent } from './race-entry/race-entry.component';
import { RaceChosenGuard } from './race-chosen.guard';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const ROUTES: Route[] = [
  {path: '', component: RaceEntryComponent, canActivate: [AuthGuard, RaceChosenGuard]},
  {path: 'races', component: RaceChooserComponent, canActivate: [AuthGuard]},
  {path: 'entries', component: RaceEntryComponent, canActivate: [AuthGuard, RaceChosenGuard]},
  {path: 'login', component: LoginComponent},
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
    MatCardModule,
    MatDialogModule,
    MatToolbarModule
    MatRippleModule,
    MatIconModule,
    HttpClientModule,
    MatRadioModule,
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
    LoginComponent,
  ],
  providers: [
    RaceChosenGuard,
    AuthGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

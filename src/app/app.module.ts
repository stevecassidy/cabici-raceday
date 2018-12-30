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


import { RiderListComponent } from './components/rider-list/rider-list.component';
import { AppComponent } from './components/app/app.component';
import { AddRiderDialogComponent } from './components/add-rider-dialog/add-rider-dialog.component';
import { EntryListComponent } from './components/entry-list/entry-list.component';
import { HeaderComponent } from './components/header/header.component';
import { RaceChooserComponent } from './components/race-chooser/race-chooser.component';
import { RaceEntryComponent } from './components/race-entry/race-entry.component';
import { RaceChosenGuard } from './guards/race-chosen.guard';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ResultsComponent } from './components/results/results.component';

const ROUTES: Route[] = [
  {path: '', component: RaceEntryComponent, canActivate: [AuthGuard, RaceChosenGuard]},
  {path: 'races', component: RaceChooserComponent, canActivate: [AuthGuard]},
  {path: 'entries', component: RaceEntryComponent, canActivate: [AuthGuard, RaceChosenGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'results', component: ResultsComponent, canActivate: [RaceChosenGuard]}
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
    MatToolbarModule,
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
    ResultsComponent,
  ],
  providers: [
    RaceChosenGuard,
    AuthGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

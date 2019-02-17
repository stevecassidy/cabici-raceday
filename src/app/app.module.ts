import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, Injectable, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from '@angular/common/http';
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
  MatRadioModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule, MatProgressBarModule
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
import { ApiHttpClient, apiHttpClientCreator} from './api-http-client';
import { AuthService } from './services/auth.service';
import { NewRiderDialogComponent } from './components/new-rider-dialog/new-rider-dialog.component';
import { UpdateEntryComponent } from './components/update-entry/update-entry.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BusydialogComponent } from './components/busydialog/busydialog.component';
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://87aa44c7f5814a72a693e2a128a1823f@sentry.io/1385448"
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    Sentry.captureException(error.originalError || error);
    throw error;
  }
}

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
    AddRiderDialogComponent,
    NewRiderDialogComponent,
    UpdateEntryComponent,
    BusydialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressBarModule,
    RouterModule.forRoot(ROUTES),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
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
    NewRiderDialogComponent,
    UpdateEntryComponent,
    BusydialogComponent,
  ],
  providers: [
    RaceChosenGuard,
    AuthGuard,
    {
      provide: ApiHttpClient,
      useFactory: apiHttpClientCreator,
      deps: [HttpClient, AuthService]
    },
    {
      provide: ErrorHandler,
      useClass: SentryErrorHandler
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

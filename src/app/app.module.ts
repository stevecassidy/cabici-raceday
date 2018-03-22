import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgbModule }     from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  } from '@angular/material';


import { AppComponent }  from './app.component';
import { RiderListComponent } from './rider-list.component';

@NgModule({
  imports:      [ 
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    RiderListComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

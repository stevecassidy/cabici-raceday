import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgbModule }     from '@ng-bootstrap/ng-bootstrap';

import { AppComponent }  from './app.component';
import { RiderListComponent } from './rider-list.component';

@NgModule({
  imports:      [ 
    BrowserModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    RiderListComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

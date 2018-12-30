import { Component } from '@angular/core';

@Component({
  selector: 'cabici',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public navLinks = [
    {path: 'entries', label: 'Entries'},
    {path: 'results', label: 'Results'}
  ];
}
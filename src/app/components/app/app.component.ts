import { Component } from '@angular/core';
import {UpdateService} from '../../services/update.service';

@Component({
  selector: 'cabici',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public navLinks = [
    {path: 'races', label: 'Race'},
    {path: 'entries', label: 'Entries'},
    {path: 'results', label: 'Results'}
  ];

  constructor(private update: UpdateService) {}
}

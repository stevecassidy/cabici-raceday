import { Injectable } from '@angular/core';
import { RACES } from './mock-races';
import {Observable, of} from 'rxjs';
import {Race} from './race';

@Injectable({
  providedIn: 'root'
})

export class RacesService {

  private _serviceUrl = '/api/races/?select=future&club=';
  private races: Race[];
  private _selected: Race;

  constructor() {
    this.races = RACES;
  }

  get selected(): Race {
    return this._selected;
  }

  set selected(value: Race) {
    this._selected = value;
    console.log("SELECTED", value);
  }

  getRaces(): Observable<Race[]> {
    return of(this.races);
  }
}

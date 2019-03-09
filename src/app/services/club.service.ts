import { Injectable } from '@angular/core';
import {ApiHttpClient} from '../api-http-client';
import {Club} from '../classes/club';
import {BehaviorSubject, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private readonly endpoint;
  private clubs: Club[];
  private _clubs: BehaviorSubject<Club[]>;

  constructor(public http: ApiHttpClient) {

    this.endpoint = '/api/clubs';
    this._clubs = <BehaviorSubject<Club[]>>new BehaviorSubject([]);
    this.loadFromLocalStorage();
  }

  getClubs(): Observable<Club[]> {
    return of(this.clubs);
  }

  clubSlugs(): string[] {
    const result: string[] = [];
    if (this.clubs) {
      for (let i = 0; i < this.clubs.length; i++) {
        result.push(this.clubs[i].slug);
      }
    }
    return result;
  }

  clubFromSlug(slug: string): Club {
    for(let i=0; i<this.clubs.length; i++) {
      if (this.clubs[i].slug === slug) {
        return this.clubs[i];
      }
    }
    return null;
  }

  loadClubs(): void {
    const response = this.http.get(this.endpoint);

    response.subscribe(httpResp => {
      this.clubs = <Club[]>httpResp;
      this.updateLocalStorage();
      this._clubs.next(Object.assign({}, this.clubs));
    });
  }

  loadFromLocalStorage(): void {
    const local = JSON.parse(window.localStorage.getItem('clubs'));
    if (local != null) {
      this.clubs = <Club[]>local;
    } else {
      // load from cabici API
      this.loadClubs();
    }
    this._clubs.next(Object.assign({}, this.clubs));
  }

  updateLocalStorage(): void {
    window.localStorage.setItem('clubs', JSON.stringify(this.clubs));
  }
}

import { Injectable } from '@angular/core';
import { Rider } from './rider';
import {Observable, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class RidersService {

  private riders = [];
  private apiUrl = 'https://cabici.net/api/riders/';

  constructor(private http: HttpClient) {
    this.riders = <Rider[]>[];
    this.loadFromLocalStorage();
  }

  getRiders(): Observable<Rider[]> {
    return of(this.riders);
  }

  loadRiders() {
    this._loadRiders(this.apiUrl);
  }

  _loadRiders(url: string): void {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Token 963f34e7eaf9ec22b5df4f2a7362fe798d16ccc6'
      })
    };

    let response = this.http.get(url, httpOptions);

    response.subscribe(httpResp => {
      const riders = <Rider[]> httpResp['results'];
      this.riders = riders;
      //if (httpResp['next']) {
        //this.loadRiders(httpResp['next']);
      // }
      window.localStorage.setItem('riders', JSON.stringify(this.riders));
      console.log('Riders loaded:', this.riders);
    });
  }

  loadFromLocalStorage(): void {
    // load riders from local storage
    const local = JSON.parse(window.localStorage.getItem('riders'));
    if (local !== null) {
      for (let i = 0; i < local.length; i++) {
        if (local[i] !== null) {
          let lr = local[i];
          let rider = new Rider(
            lr.id,
            lr.first_name,
            lr.last_name,
            lr.club,
            lr.clubslug,
            lr.licenceno,
            lr.classification,
            lr.member_category,
            lr.member_date,
            lr.grades,
            lr.gender,
            lr.emergencyphone,
            lr.emergencyname
          );
          this.riders.push(rider);
        }
      }
    } else {
      // force load from cabici API
      this.loadRiders();
    }
  }


}


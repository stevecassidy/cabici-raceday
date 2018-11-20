import { Injectable } from '@angular/core';
import { Rider } from './rider';
import { RIDERS } from './mock-riders';
import {Entry} from './entry';


@Injectable({
  providedIn: 'root'
})
export class RidersService {

  riders = [];

  constructor() {
    this.loadRiders();
  }

  getRiders(): Rider [] {
    return this.riders;
  }

  loadRiders(): void {
    this.riders = []
      for (let i = 0; i < RIDERS.length; i++) {
        let lr = RIDERS[i];
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
}


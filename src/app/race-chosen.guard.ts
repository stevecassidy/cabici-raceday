import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {RacesService} from './races.service';

@Injectable({
  providedIn: 'root'
})
export class RaceChosenGuard implements CanActivate {

  constructor(private racesService: RacesService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.racesService.selected) {
      return true;
    } else {
      this.router.navigate(['races']);
      return false;
    }
  }
}

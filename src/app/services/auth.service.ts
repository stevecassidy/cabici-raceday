import { Injectable } from '@angular/core';
import {User} from '../classes/user';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _status: BehaviorSubject<string>;
  private loggedin: boolean;
  private user: User;
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiURL + '/api/token-auth/';
    this.loggedin = false;
    this._status = <BehaviorSubject<string>>new BehaviorSubject('');
    this.loadFromLocalStorage();
   }

  currentUser(): User {
    if (this.loggedin) {
      return this.user;
    } else {
      return null;
    }
  }

  loggedIn(): boolean {
    return this.loggedin;
  }

  login(email: string, password: string): Observable<string> {

    const body = new HttpParams()
      .set('email', email)
      .set('password', password);

    this.http.post(this.apiUrl, body.toString(),{
      headers: new HttpHeaders()
                   .set('Content-Type', 'application/x-www-form-urlencoded')
      }).subscribe(
      httpResp => {
          this.user = <User>httpResp;
          this.loggedin = true;
          this.updateLocalStorage();
          this._status.next('loggedin');},
      error => {
          this._status.next('invalid');
      });

    this._status.next('pending');
    return this._status.asObservable();
  }

  loadFromLocalStorage(): void {
    // load user from local storage
    const local = JSON.parse(window.localStorage.getItem('user'));
    console.log(local);
    if (local !== null) {
      this.user = <User>local;
      this.loggedin = true;
    }
  }

  updateLocalStorage(): void {
    window.localStorage.setItem('user', JSON.stringify(this.user));
  }


  logout(): void {
    this.user = null;
    this.loggedin = false;
    this.updateLocalStorage();
  }
}

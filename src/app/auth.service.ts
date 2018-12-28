import { Injectable } from '@angular/core';
import {User} from './user';
import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _status: BehaviorSubject<User>;
  private loggedin: boolean;
  private user: User;
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiURL + "/api/token-auth/";
    this.loggedin = false;
    this._status = <BehaviorSubject<User>>new BehaviorSubject(null);
    this.loadFromLocalStorage();
   }

  currentUser(): User {
    if (this.loggedin) {
      return this.user;
    } else {
      return null;
    }
  }

  login(email: string, password: string): Observable<User> {

    const body = new HttpParams()
      .set('email', email)
      .set('password', password);

    let response = this.http.post(this.apiUrl, body.toString(),{
      headers: new HttpHeaders()
                   .set('Content-Type', 'application/x-www-form-urlencoded')
      });

    response.subscribe(httpResp => {
      this.user = <User>httpResp;
      this.loggedin = true;
      this.updateLocalStorage();
      this._status.next(this.user);
    });

    return this._status.asObservable();
  }

  loadFromLocalStorage(): void {
    // load user from local storage
    const local = JSON.parse(window.localStorage.getItem('user'));
    if (local !== null) {
      this.user = <User>local;
      this.loggedin = true;
    }
  }

  updateLocalStorage(): void {
    window.localStorage.setItem('user', JSON.stringify(this.user));
  }
}

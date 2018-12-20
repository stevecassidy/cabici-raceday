import { Injectable } from '@angular/core';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedin: boolean;
  private user: User;

  constructor() {
    this.loggedin = false;
    this.user = new User('Steve', 'Cassidy', '963f34e7eaf9ec22b5df4f2a7362fe798d16ccc6')

  }

  currentUser(): User {
    if (this.loggedin) {
      return this.user;
    } else {
      return null;
    }
  }

  login(email: string, password: string): boolean {
    console.log("Login: ", email, password);
    this.loggedin = true;
    return this.loggedin;
  }
}

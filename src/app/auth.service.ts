import { Injectable } from '@angular/core';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  currentUser(): User {
    return new User('Steve', 'Cassidy', '963f34e7eaf9ec22b5df4f2a7362fe798d16ccc6')
  }
}

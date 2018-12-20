import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private email: string;
  private password: string;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }


  login(): void {
    if (this.authService.login(this.email, this.password)) {
      this.router.navigate(['']);
    }
  }

}

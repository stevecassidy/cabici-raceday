import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {RacesService} from '../../services/races.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;
  public message: string;

  constructor(private authService: AuthService,
              private racesService: RacesService,
              private router: Router) { }

  ngOnInit() {
    this.message = '';
  }

  login(): void {
    this.authService.login(this.email, this.password)
      .subscribe(status => {
        if (status === 'loggedin') {
          this.message = '';
          this.racesService.loadFromLocalStorage();
          this.router.navigate(['entries']);
        } else if (status === 'invalid') {
          this.message = 'Invalid Login';
        } else {
          this.message = 'Pending';
        }
      }
    );
  }

}

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

  constructor(private authService: AuthService,
              private racesService: RacesService,
              private router: Router) { }

  ngOnInit() {
  }

  login(): void {
    this.authService.login(this.email, this.password)
      .subscribe(user => {
        this.racesService.loadFromLocalStorage();
        this.router.navigate(['entries']);
      }
    );
  }

  cancel(): boolean {
    return false;
  }

}

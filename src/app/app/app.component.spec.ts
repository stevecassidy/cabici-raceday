import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {RiderListComponent} from './rider-list/rider-list.component';
import {Component} from '@angular/core';

@Component({selector: 'rider-list', template: ""})
class RiderListStubComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        RiderListStubComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

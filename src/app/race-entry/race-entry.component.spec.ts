import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceEntryComponent } from './race-entry.component';

describe('RaceEntryComponent', () => {
  let component: RaceEntryComponent;
  let fixture: ComponentFixture<RaceEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

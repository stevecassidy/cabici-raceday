import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusydialogComponent } from './busydialog.component';

describe('BusydialogComponent', () => {
  let component: BusydialogComponent;
  let fixture: ComponentFixture<BusydialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusydialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

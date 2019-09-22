import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderListComponent } from './rider-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('RiderListComponent', () => {
  let component: RiderListComponent;
  let fixture: ComponentFixture<RiderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiderListComponent ],
      imports: [
        MatPaginatorModule,
        MatDialogModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatTableModule,
        MatInputModule,
        MatTabsModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

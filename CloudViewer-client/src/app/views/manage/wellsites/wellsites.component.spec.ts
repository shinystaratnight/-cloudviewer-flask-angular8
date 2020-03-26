import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellsitesComponent } from './wellsites.component';

describe('WellsitesComponent', () => {
  let component: WellsitesComponent;
  let fixture: ComponentFixture<WellsitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellsitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellsitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

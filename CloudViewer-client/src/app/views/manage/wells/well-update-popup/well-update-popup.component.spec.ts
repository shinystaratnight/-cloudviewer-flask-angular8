import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellUpdatePopupComponent } from './well-update-popup.component';

describe('WellUpdatePopupComponent', () => {
  let component: WellUpdatePopupComponent;
  let fixture: ComponentFixture<WellUpdatePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellUpdatePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

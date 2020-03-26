import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexibleDialogComponent } from './flexible-dialog.component';

describe('FlexibleDialogComponent', () => {
  let component: FlexibleDialogComponent;
  let fixture: ComponentFixture<FlexibleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexibleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexibleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellsiteFilesComponent } from './wellsite-files.component';

describe('WellsiteFilesComponent', () => {
  let component: WellsiteFilesComponent;
  let fixture: ComponentFixture<WellsiteFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellsiteFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellsiteFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

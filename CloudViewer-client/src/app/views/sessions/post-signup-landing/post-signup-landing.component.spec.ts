import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSignupLandingComponent } from './post-signup-landing.component';

describe('PostSignupLandingComponent', () => {
  let component: PostSignupLandingComponent;
  let fixture: ComponentFixture<PostSignupLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostSignupLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostSignupLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

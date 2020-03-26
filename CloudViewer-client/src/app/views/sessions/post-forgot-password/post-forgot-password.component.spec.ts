import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostForgotPasswordComponent } from './post-forgot-password.component';

describe('PostForgotPasswordComponent', () => {
  let component: PostForgotPasswordComponent;
  let fixture: ComponentFixture<PostForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

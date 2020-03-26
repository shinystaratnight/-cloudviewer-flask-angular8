import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountResetComponent } from './account-reset.component';

describe('AccountResetComponent', () => {
  let component: AccountResetComponent;
  let fixture: ComponentFixture<AccountResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

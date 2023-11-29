import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginModifyComponent } from './login-modify.component';

describe('LoginModifyComponent', () => {
  let component: LoginModifyComponent;
  let fixture: ComponentFixture<LoginModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginModifyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

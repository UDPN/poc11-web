import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterpriseOnboardingComponent } from './enterprise-onboarding.component';

describe('EnterpriseOnboardingComponent', () => {
  let component: EnterpriseOnboardingComponent;
  let fixture: ComponentFixture<EnterpriseOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterpriseOnboardingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EnterpriseOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

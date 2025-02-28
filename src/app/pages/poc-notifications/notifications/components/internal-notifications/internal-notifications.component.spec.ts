import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalNotificationsComponent } from './internal-notifications.component';

describe('InternalNotificationsComponent', () => {
  let component: InternalNotificationsComponent;
  let fixture: ComponentFixture<InternalNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalNotificationsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InternalNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemNoticesComponent } from './system-notices.component';

describe('SystemNoticesComponent', () => {
  let component: SystemNoticesComponent;
  let fixture: ComponentFixture<SystemNoticesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemNoticesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SystemNoticesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

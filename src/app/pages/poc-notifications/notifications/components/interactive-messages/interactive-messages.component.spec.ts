import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InteractiveMessagesComponent } from './interactive-messages.component';

describe('InteractiveMessagesComponent', () => {
  let component: InteractiveMessagesComponent;
  let fixture: ComponentFixture<InteractiveMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveMessagesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

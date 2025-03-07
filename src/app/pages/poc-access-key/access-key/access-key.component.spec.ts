import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessKeyComponent } from './access-key.component';

describe('AccessKeyComponent', () => {
  let component: AccessKeyComponent;
  let fixture: ComponentFixture<AccessKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessKeyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

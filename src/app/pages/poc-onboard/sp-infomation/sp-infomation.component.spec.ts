import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpInfomationComponent } from './sp-infomation.component';


describe('SpInfomationComponent', () => {
  let component: SpInfomationComponent;
  let fixture: ComponentFixture<SpInfomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpInfomationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopUpWithdrawComponent } from './top-up-withdraw.component';

describe('TopUpWithdrawComponent', () => {
  let component: TopUpWithdrawComponent;
  let fixture: ComponentFixture<TopUpWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopUpWithdrawComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TopUpWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

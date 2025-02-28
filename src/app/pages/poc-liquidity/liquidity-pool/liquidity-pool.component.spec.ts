import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiquidityPoolComponent } from './liquidity-pool.component';

describe('LiquidityPoolComponent', () => {
  let component: LiquidityPoolComponent;
  let fixture: ComponentFixture<LiquidityPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiquidityPoolComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LiquidityPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

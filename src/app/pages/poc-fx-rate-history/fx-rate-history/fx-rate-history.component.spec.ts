import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FxRateHistoryComponent } from './fx-rate-history.component';


describe('FxRateHistoryComponent', () => {
  let component: FxRateHistoryComponent;
  let fixture: ComponentFixture<FxRateHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FxRateHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FxRateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
